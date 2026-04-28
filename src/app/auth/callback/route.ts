import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next"); // custom redirect after exchange

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If a custom next destination was passed (e.g. /affiliate/setup), honour it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("xm_account_id, is_verified_affiliate")
          .eq("id", user.id)
          .single();

        if (profile?.is_verified_affiliate) {
          return NextResponse.redirect(`${origin}/affiliate/dashboard`);
        }

        // New user (no broker account yet) → onboarding
        if (!profile?.xm_account_id) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
