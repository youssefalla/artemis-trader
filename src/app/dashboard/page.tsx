import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardView from "@/components/dashboard/DashboardView";
import type { Profile, BotSettings, TradeHistory } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile, bot settings, and recent trades in parallel
  const [profileResult, botResult, tradesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("bot_settings").select("*").eq("user_id", user.id).single(),
    supabase
      .from("trade_history")
      .select("*")
      .eq("user_id", user.id)
      .order("opened_at", { ascending: false })
      .limit(20),
  ]);

  const profile = profileResult.data as Profile | null;
  const botSettings = botResult.data as BotSettings | null;
  const trades: TradeHistory[] = (tradesResult.data as TradeHistory[] | null) ?? [];

  return <DashboardView profile={profile} botSettings={botSettings} trades={trades} />;
}
