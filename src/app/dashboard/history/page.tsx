import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TradeHistoryTable from "@/components/dashboard/TradeHistoryTable";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Trade History</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          All trades executed by Artemis on your account
        </p>
      </div>
      <TradeHistoryTable trades={trades} />
    </div>
  );
}
