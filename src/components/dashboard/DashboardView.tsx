"use client";

import { useT } from "@/lib/i18n";
import StatsCard from "@/components/dashboard/StatsCard";
import BotToggle from "@/components/dashboard/BotToggle";
import TradeHistoryTable from "@/components/dashboard/TradeHistoryTable";
import MT5ConnectionForm from "@/components/dashboard/MT5ConnectionForm";
import { DollarSign, TrendingUp, Activity, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Profile, BotSettings, TradeHistory } from "@/types";

interface Props {
  profile: Profile | null;
  botSettings: BotSettings | null;
  trades: TradeHistory[];
}

export default function DashboardView({ profile, botSettings, trades }: Props) {
  const { T, lang } = useT();

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
    if (hour < 12) return T.dashboardPage.greetMorning;
    if (hour < 18) return T.dashboardPage.greetAfternoon;
    return T.dashboardPage.greetEvening;
  };

  const dateStr = new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : lang === "it" ? "it-IT" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isActive = profile?.subscription_status === "active";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            {greeting()}, {profile?.full_name?.split(" ")[0] ?? "Trader"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{dateStr}</p>
        </div>

        <div
          className="px-4 py-2 rounded-xl text-xs font-semibold border"
          style={{
            background: isActive ? "rgba(0, 212, 160, 0.12)" : "rgba(255, 77, 106, 0.12)",
            borderColor: isActive ? "var(--green)" : "var(--red)",
            color: isActive ? "var(--green)" : "var(--red)",
          }}
        >
          {isActive ? T.dashboardPage.activePlan : T.dashboardPage.noSub}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title={T.dashboardPage.totalProfit}
          value={formatCurrency(totalProfit)}
          subtitle={T.dashboardPage.allClosedTrades}
          icon={DollarSign}
          trend={totalProfit >= 0 ? "up" : "down"}
          trendValue={`${Math.abs(totalProfit).toFixed(2)} USD`}
          accentColor={totalProfit >= 0 ? "var(--green)" : "var(--red)"}
        />
        <StatsCard
          title={T.dashboardPage.winRate}
          value={`${winRate}%`}
          subtitle={`${winningTrades.length} / ${closedTrades.length} trades`}
          icon={Target}
          trend={winRate >= 60 ? "up" : winRate >= 40 ? "neutral" : "down"}
          trendValue={winRate >= 60 ? T.dashboardPage.aboveTarget : T.dashboardPage.belowTarget}
          accentColor="var(--accent)"
        />
        <StatsCard
          title={T.dashboardPage.openTrades}
          value={String(openTrades.length)}
          subtitle={T.dashboardPage.currentlyActive}
          icon={Activity}
          accentColor="var(--gold)"
        />
        <StatsCard
          title={T.dashboardPage.totalTrades}
          value={String(trades.length)}
          subtitle={`${closedTrades.length} ${T.dashboardPage.closed}`}
          icon={TrendingUp}
          accentColor="var(--accent)"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-4">
          <BotToggle
            initialActive={botSettings?.bot_active ?? false}
            initialRisk={botSettings?.risk_level ?? "Low"}
            isVerifiedAffiliate={profile?.is_verified_affiliate ?? false}
            subscriptionStatus={profile?.subscription_status ?? "inactive"}
          />
          <MT5ConnectionForm currentXmAccountId={profile?.xm_account_id ?? null} />
        </div>
        <div className="xl:col-span-2">
          <TradeHistoryTable trades={trades} />
        </div>
      </div>
    </div>
  );
}
