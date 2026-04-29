import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Artemis AI, a professional trading assistant for the Artemis Trader platform. You specialize in:
- Forex and Gold (XAUUSD) trading analysis
- Market news and trends
- Technical analysis (support/resistance, trends, indicators)
- Risk management advice
- Explaining dashboard data and trading metrics

Be concise, professional, and helpful. Format responses clearly. When discussing prices or market data, mention that your knowledge has a cutoff and users should verify live data. Always emphasize risk management. Never give direct financial advice — provide analysis and education only.`;

type RawPart = { type: string; text?: string; source?: { data: string; media_type: string } };
type RawMessage = { role: string; content: string | RawPart[] };

function toGeminiParts(content: string | RawPart[]) {
  if (typeof content === "string") return [{ text: content }];
  return content.map((p) => {
    if (p.type === "text")  return { text: p.text ?? "" };
    if (p.type === "image") return { inlineData: { data: p.source!.data, mimeType: p.source!.media_type } };
    return { text: "" };
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages }: { messages: RawMessage[] } = await request.json();
  if (!messages?.length) return NextResponse.json({ error: "No messages" }, { status: 400 });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const last    = messages[messages.length - 1];
    const history = messages.slice(0, -1).map((m) => ({
      role:  m.role === "assistant" ? "model" : "user",
      parts: toGeminiParts(m.content),
    }));

    const chat   = model.startChat({ history });
    const result = await chat.sendMessage(toGeminiParts(last.content));
    const reply  = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    console.error("Gemini error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
