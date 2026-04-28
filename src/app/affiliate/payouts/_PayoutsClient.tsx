"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type Payout = { id: string; amount: number; status: string; method: string | null; requested_at: string; paid_at: string | null; notes: string | null };

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending:    { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    processing: { bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
    paid:       { bg: "rgba(5,150,105,0.12)",  color: "#34d399" },
    cancelled:  { bg: "rgba(220,38,38,0.10)",  color: "#f87171" },
  };
  const s = map[status] ?? map.pending;
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.625rem", borderRadius: "9999px", background: s.bg, color: s.color }}>{status}</span>;
}

const MIN_PAYOUT = 50;

export default function PayoutsClient({ available, payouts, affiliateId }: { available: number; payouts: Payout[]; affiliateId: string }) {
  const [amount, setAmount]       = useState("");
  const [method, setMethod]       = useState("paypal");
  const [details, setDetails]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function requestPayout(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < MIN_PAYOUT) { setError(`Minimum payout is $${MIN_PAYOUT}`); return; }
    if (amt > available) { setError("Amount exceeds available balance"); return; }
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("affiliate_payouts").insert({
      affiliate_id: affiliateId, amount: amt, method, notes: details || null,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true); setAmount(""); setDetails("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Request payout form */}
      <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Request Payout
        </p>

        {success ? (
          <div style={{ padding: "1.25rem", borderRadius: "0.875rem", background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.25)", color: "#34d399", fontSize: "0.9rem", fontWeight: 600 }}>
            ✓ Payout request submitted! We'll process it within 3–5 business days.
          </div>
        ) : (
          <form onSubmit={requestPayout} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontSize: "0.85rem" }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Amount ($)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min $${MIN_PAYOUT}`} min={MIN_PAYOUT} max={available} step="0.01"
                  style={{ padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.14)")} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}
                  style={{ padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none", cursor: "pointer" }}>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="crypto">Crypto (USDT)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Payment Details</label>
              <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. your@paypal.com or wallet address"
                style={{ padding: "0.75rem 1rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.14)")} />
            </div>

            <button type="submit" disabled={loading || available < MIN_PAYOUT}
              style={{ alignSelf: "flex-start", padding: "0.8125rem 2rem", borderRadius: "0.875rem", border: "none", background: available < MIN_PAYOUT ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#D4AF37,#f0d060)", color: available < MIN_PAYOUT ? "var(--text-secondary)" : "#0a0700", fontSize: "0.9rem", fontWeight: 700, cursor: available < MIN_PAYOUT ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: available >= MIN_PAYOUT ? "0 4px 16px rgba(212,175,55,0.30)" : "none", transition: "all 0.2s" }}>
              {loading && <Loader2 size={15} className="animate-spin" />}
              {available < MIN_PAYOUT ? `Min. balance $${MIN_PAYOUT} required` : "Request Payout"}
            </button>
          </form>
        )}
      </div>

      {/* Payout history */}
      <div className="bento" style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", padding: "1.5rem 1.5rem 1rem" }}>
          Payout History
        </p>
        {!payouts.length ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>No payouts yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Date", "Amount", "Method", "Status", "Paid On"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < payouts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{new Date(p.requested_at).toLocaleDateString()}</td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.9rem", fontWeight: 700, color: "#D4AF37" }}>${p.amount.toFixed(2)}</td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{p.method ?? "—"}</td>
                  <td style={{ padding: "0.875rem 1.25rem" }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
