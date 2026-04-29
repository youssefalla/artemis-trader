import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
