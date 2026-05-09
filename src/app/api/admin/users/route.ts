import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "youssefalla674@gmail.com";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

// GET — all users with new fields
export async function GET() {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name, broker, mt5_login, mt5_server, xm_account_id, subscription_status, is_verified_affiliate, bot_access_granted, copy_trading_enabled, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — grant/revoke bot access or copy trading
export async function PATCH(req: Request) {
  const user = await checkAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });

  const body = await req.json();
  const { userId, field, value } = body;

  if (!userId || !field) return NextResponse.json({ error: "Missing userId or field" }, { status: 400 });
  if (!["bot_access_granted", "copy_trading_enabled", "subscription_status"].includes(field))
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ [field]: value } as any)
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
