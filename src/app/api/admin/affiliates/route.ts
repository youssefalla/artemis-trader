import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "youssefalla674@gmail.com";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });
  }

  const admin = createAdminClient();
  const [{ data: affiliates, error: aErr }, { data: profiles, error: pErr }] = await Promise.all([
    admin.from("affiliates").select("id, code, commission_rate, tier, total_clicks, total_referrals, total_conversions, total_earned, total_paid").order("total_earned", { ascending: false }),
    admin.from("profiles").select("id, email, full_name"),
  ]);

  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  return NextResponse.json({ affiliates, profiles });
}
