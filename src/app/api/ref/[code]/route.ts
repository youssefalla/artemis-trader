import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemis-trader.com";

  try {
    const supabase = await createClient();

    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id")
      .eq("code", code.toUpperCase())
      .single();

    if (affiliate) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
      const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
      const referrer = request.headers.get("referer") ?? null;

      await supabase.from("affiliate_clicks").insert({
        affiliate_id: affiliate.id,
        ip_hash: ipHash,
        referrer,
      });
    }
  } catch {
    // Silently ignore — don't block the redirect on tracking errors
  }

  const url = request.nextUrl.clone();
  const search = url.search; // preserve any ?utm_* params

  return NextResponse.redirect(`${siteUrl}${search}`, { status: 302 });
}
