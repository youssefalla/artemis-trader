import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Artemis AI, a professional trading assistant for the Artemis Trader platform. You specialize in:
- Forex and Gold (XAUUSD) trading analysis
- Market news and trends
- Technical analysis (support/resistance, trends, indicators)
- Risk management advice
- Explaining dashboard data and trading metrics

Be concise, professional, and helpful. Format responses clearly. When discussing prices or market data, mention that your knowledge has a cutoff and users should verify live data. Always emphasize risk management. Never give direct financial advice — provide analysis and education only.`;

type RawPart = { type: string; text?: string; source?: { data: string; media_type: string } };
type RawMessage = { role: "user" | "assistant"; content: string | RawPart[] };

function toAnthropicMessages(messages: RawMessage[]): MessageParam[] {
  return messages.map((m) => {
    if (typeof m.content === "string") return { role: m.role, content: m.content };
    const content = m.content.map((p) => {
      if (p.type === "text")  return { type: "text" as const, text: p.text ?? "" };
      if (p.type === "image") return {
        type: "image" as const,
        source: { type: "base64" as const, media_type: p.source!.media_type as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: p.source!.data },
      };
      return { type: "text" as const, text: "" };
    });
    return { role: m.role, content };
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages }: { messages: RawMessage[] } = await request.json();
  if (!messages?.length) return NextResponse.json({ error: "No messages" }, { status: 400 });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: toAnthropicMessages(messages),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    console.error("Claude error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
