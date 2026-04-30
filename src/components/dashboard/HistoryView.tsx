"use client";

import { useT } from "@/lib/i18n";
import TradeHistoryTable from "@/components/dashboard/TradeHistoryTable";
import type { TradeHistory } from "@/types";

export default function HistoryView({ trades }: { trades: TradeHistory[] }) {
  const { T } = useT();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          {T.historyPage.title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          {T.historyPage.subtitle}
        </p>
      </div>
      <TradeHistoryTable trades={trades} />
    </div>
  );
}
