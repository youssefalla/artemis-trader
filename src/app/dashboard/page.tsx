import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatsCard from "@/components/dashboard/StatsCard";
import BotToggle from "@/components/dashboard/BotToggle";
import TradeHistoryTable from "@/components/dashboard/TradeHistoryTable";
import MT5ConnectionForm from "@/components/dashboard/MT5ConnectionForm";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
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

  // Compute aggregate stats from trade history
  const closedTrades = trades.filter((t) => t.status === "closed");
  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit ?? 0), 0);
  const winningTrades = closedTrades.filter((t) => (t.profit ?? 0) > 0);
  const winRate =
    closedTrades.length > 0
      ? Math.round((winningTrades.length / closedTrades.length) * 100)
      : 0;
  const openTrades = trades.filter((t) => t.status === "open");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            {greeting()}, {profile?.full_name?.split(" ")[0] ?? "Trader"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Subscription badge */}
        <div
          className="px-4 py-2 rounded-xl text-xs font-semibold border"
          style={{
            background:
              profile?.subscription_status === "active"
                ? "rgba(0, 212, 160, 0.12)"
                : "rgba(255, 77, 106, 0.12)",
            borderColor:
              profile?.subscription_status === "active"
                ? "var(--green)"
                : "var(--red)",
            color:
              profile?.subscription_status === "active"
                ? "var(--green)"
                : "var(--red)",
          }}
        >
          {profile?.subscription_status === "active" ? "● Active Plan" : "● No Subscription"}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Profit"
          value={formatCurrency(totalProfit)}
          subtitle="All closed trades"
          icon={DollarSign}
          trend={totalProfit >= 0 ? "up" : "down"}
          trendValue={`${Math.abs(totalProfit).toFixed(2)} USD`}
          accentColor={totalProfit >= 0 ? "var(--green)" : "var(--red)"}
        />
        <StatsCard
          title="Win Rate"
          value={`${winRate}%`}
          subtitle={`${winningTrades.length} / ${closedTrades.length} trades`}
          icon={Target}
          trend={winRate >= 60 ? "up" : winRate >= 40 ? "neutral" : "down"}
          trendValue={winRate >= 60 ? "Above target" : "Below target"}
          accentColor="var(--accent)"
        />
        <StatsCard
          title="Open Trades"
          value={String(openTrades.length)}
          subtitle="Currently active"
          icon={Activity}
          accentColor="var(--gold)"
        />
        <StatsCard
          title="Total Trades"
          value={String(trades.length)}
          subtitle={`${closedTrades.length} closed`}
          icon={TrendingUp}
          accentColor="var(--accent)"
        />
      </div>

      {/* Main content: 2-col */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Bot + MT5 */}
        <div className="xl:col-span-1 space-y-4">
          <BotToggle
            initialActive={botSettings?.bot_active ?? false}
            initialRisk={botSettings?.risk_level ?? "Low"}
            isVerifiedAffiliate={profile?.is_verified_affiliate ?? false}
            subscriptionStatus={profile?.subscription_status ?? "inactive"}
          />
          <MT5ConnectionForm currentXmAccountId={profile?.xm_account_id ?? null} />
        </div>

        {/* Right: Trade history */}
        <div className="xl:col-span-2">
          <TradeHistoryTable trades={trades} />
        </div>
      </div>
    </div>
  );
}
