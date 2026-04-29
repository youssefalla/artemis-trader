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

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await request.json();
  if (!messages?.length) return NextResponse.json({ error: "No messages" }, { status: 400 });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build Gemini chat history (all except last message)
    const history = messages.slice(0, -1).map((m: { role: string; content: unknown }) => {
      const isUser = m.role === "user";
      // Handle multimodal (image) messages
      if (Array.isArray(m.content)) {
        const parts = m.content.map((part: { type: string; text?: string; source?: { data: string; media_type: string } }) => {
          if (part.type === "text") return { text: part.text };
          if (part.type === "image") return {
            inlineData: { data: part.source!.data, mimeType: part.source!.media_type },
          };
          return { text: "" };
        });
        return { role: isUser ? "user" : "model", parts };
      }
      return { role: isUser ? "user" : "model", parts: [{ text: m.content as string }] };
    });

    const chat = model.startChat({ history });

    // Last message (current user input)
    const last = messages[messages.length - 1];
    let result;

    if (Array.isArray(last.content)) {
      const parts = last.content.map((part: { type: string; text?: string; source?: { data: string; media_type: string } }) => {
        if (part.type === "text") return { text: part.text };
        if (part.type === "image") return {
          inlineData: { data: part.source!.data, mimeType: part.source!.media_type },
        };
        return { text: "" };
      });
      result = await chat.sendMessage(parts);
    } else {
      result = await chat.sendMessage(last.content);
    }

    const reply = result.response.text();
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
