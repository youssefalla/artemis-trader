import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "youssefalla674@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemis-trader.com";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, code, commission } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/affiliate/setup`,
  });

  if (inviteErr) {
    return NextResponse.json({ error: inviteErr.message }, { status: 400 });
  }

  // Grant affiliate access — profile is created synchronously via trigger
  const { error: grantErr } = await admin.rpc("grant_affiliate", {
    p_email: email,
    p_code: code.toUpperCase(),
    p_commission: commission ?? 20,
  });

  if (grantErr) {
    // Invited but grant failed — still return partial success
    return NextResponse.json({ warning: "Invited but affiliate grant failed: " + grantErr.message, userId: invited.user?.id });
  }

  return NextResponse.json({ success: true, userId: invited.user?.id });
}
