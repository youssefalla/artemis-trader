"use client";

import { useState } from "react";
import { Link2, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MT5ConnectionFormProps {
  currentXmAccountId: string | null;
}

export default function MT5ConnectionForm({ currentXmAccountId }: MT5ConnectionFormProps) {
  const [accountId, setAccountId] = useState(currentXmAccountId ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("profiles").update({ xm_account_id: accountId.trim() } as any).eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{
          width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
          display: "grid", placeItems: "center",
          background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)",
        }}>
          <Link2 size={16} style={{ color: "#D4AF37" }} />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>MT5 Connection</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>Link your XM broker account</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.22)", color: "#f87171", fontSize: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.75rem" }}>
            <AlertTriangle size={13} />{error}
          </div>
        )}
        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,212,160,0.08)", border: "1px solid rgba(0,212,160,0.25)", color: "var(--green)", fontSize: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.75rem" }}>
            <CheckCircle size={13} />XM Account ID saved successfully.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>
            XM Account ID (MT5)
          </label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="e.g. 12345678"
            required
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.60)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              color: "var(--text-primary)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
          />
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
            Find this in your XM Members Area under MT5 accounts.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold"
          style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.7 : 1 }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Saving…" : "Save Connection"}
        </button>
      </form>
    </div>
  );
}
