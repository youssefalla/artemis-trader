import type { TradeHistory } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TradeHistoryTableProps {
  trades: TradeHistory[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  if (trades.length === 0) {
    return (
      <div className="bento" style={{ borderRadius: "1.125rem", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No trades yet. Activate the bot to start trading.</p>
      </div>
    );
  }

  return (
    <div className="bento" style={{ borderRadius: "1.125rem", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <h2 className="font-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>Recent Trades</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Symbol", "Type", "Lot", "Open", "Close", "Profit", "Status", "Time"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {trades.map((trade) => {
              const isProfit = (trade.profit ?? 0) >= 0;
              return (
                <tr
                  key={trade.id}
                  className="hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                    {trade.symbol}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          trade.order_type === "BUY"
                            ? "rgba(0, 212, 160, 0.12)"
                            : "rgba(255, 77, 106, 0.12)",
                        color:
                          trade.order_type === "BUY"
                            ? "var(--green)"
                            : "var(--red)",
                      }}
                    >
                      {trade.order_type === "BUY" ? (
                        <TrendingUp size={11} />
                      ) : (
                        <TrendingDown size={11} />
                      )}
                      {trade.order_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {trade.lot_size}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {trade.open_price}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {trade.close_price ?? "—"}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{
                      color:
                        trade.profit === null
                          ? "var(--text-secondary)"
                          : isProfit
                          ? "var(--green)"
                          : "var(--red)",
                    }}
                  >
                    {trade.profit !== null
                      ? formatCurrency(trade.profit)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          trade.status === "open"
                            ? "rgba(108, 99, 255, 0.12)"
                            : "rgba(136, 136, 170, 0.1)",
                        color:
                          trade.status === "open"
                            ? "var(--accent)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {formatDate(trade.opened_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
