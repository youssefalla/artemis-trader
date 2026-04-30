import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HistoryView from "@/components/dashboard/HistoryView";
import type { TradeHistory } from "@/types";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trade_history")
    .select("*")
    .eq("user_id", user.id)
    .order("opened_at", { ascending: false });

  const trades: TradeHistory[] = data ?? [];

  return <HistoryView trades={trades} />;
}
