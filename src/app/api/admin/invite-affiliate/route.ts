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

  const password = process.env.AFFILIATE_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "AFFILIATE_PASSWORD env var not set" }, { status: 500 });
  }

  const admin = createAdminClient();

  // Send Supabase invite email (uses the custom template from Supabase dashboard)
  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/affiliate/dashboard`,
  });

  if (inviteErr) {
    return NextResponse.json({ error: inviteErr.message }, { status: 400 });
  }

  // Set the shared affiliate password immediately — influencer can login without "set password" step
  await admin.auth.admin.updateUserById(invited.user.id, { password });

  // Grant affiliate access
  const { error: grantErr } = await admin.rpc("grant_affiliate", {
    p_email: email,
    p_code: code.toUpperCase(),
    p_commission: commission ?? 20,
  });

  if (grantErr) {
    return NextResponse.json({ warning: "Invited but affiliate grant failed: " + grantErr.message, userId: invited.user.id });
  }

  return NextResponse.json({ success: true, userId: invited.user.id });
}
