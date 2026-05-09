"use client";

import { useState } from "react";
import { Link2, CheckCircle, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MT5ConnectionFormProps {
  currentXmAccountId: string | null;
  currentBroker?: string | null;
  currentMt5Login?: string | null;
  currentMt5Server?: string | null;
}

const SERVERS: Record<string, string[]> = {
  xm: [
    "XMGlobal-Real",
    "XMGlobal-Real 2",
    "XMGlobal-Real 3",
    "XMGlobal-Real 4",
    "XMGlobal-Real 5",
    "XM-Real",
    "XM-Real 2",
    "XM-Real 3",
  ],
  exness: [
    "Exness-Real",
    "Exness-Real2",
    "Exness-Real3",
    "Exness-Real4",
    "ExnessGlobal-Real",
    "ExnessGlobal-Real2",
  ],
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "rgba(255,255,255,0.45)",
  border: "1px solid rgba(255,255,255,0.60)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: "0.6875rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "var(--text-secondary)",
};

export default function MT5ConnectionForm({
  currentXmAccountId,
  currentBroker,
  currentMt5Login,
  currentMt5Server,
}: MT5ConnectionFormProps) {
  const [broker, setBroker] = useState<"xm" | "exness">(
    (currentBroker as "xm" | "exness") ?? "xm"
  );
  const [mt5Login, setMt5Login] = useState(currentMt5Login ?? "");
  const [investorPassword, setInvestorPassword] = useState("");
  const [server, setServer] = useState(currentMt5Server ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleBrokerChange(b: "xm" | "exness") {
    setBroker(b);
    setServer("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!mt5Login || !investorPassword || !server) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await supabase.from("profiles").update({
      broker,
      mt5_login: mt5Login.trim(),
      mt5_investor_password: investorPassword,
      mt5_server: server,
      xm_account_id: mt5Login.trim(),
    } as any).eq("id", user.id);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSuccess(true);
      setInvestorPassword("");
      setTimeout(() => setSuccess(false), 4000);
    }
    setLoading(false);
  }

  const isConnected = !!(currentMt5Login && currentMt5Server);

  return (
    <div className="bento" style={{ borderRadius: "1.125rem", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{
          width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
          display: "grid", placeItems: "center",
          background: isConnected ? "rgba(0,212,160,0.10)" : "rgba(212,175,55,0.10)",
          border: isConnected ? "1px solid rgba(0,212,160,0.25)" : "1px solid rgba(212,175,55,0.25)",
        }}>
          <Link2 size={16} style={{ color: isConnected ? "var(--green)" : "#D4AF37" }} />
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>MT5 Connection</p>
          <p style={{ fontSize: "0.75rem", color: isConnected ? "var(--green)" : "var(--text-secondary)", marginTop: "0.1rem" }}>
            {isConnected ? `Connected · ${currentBroker?.toUpperCase()} #${currentMt5Login}` : "Link your broker account"}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.22)", color: "#f87171", fontSize: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", marginBottom: "0.875rem" }}>
          <AlertTriangle size={13} />{error}
        </div>
      )}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,212,160,0.08)", border: "1px solid rgba(0,212,160,0.25)", color: "var(--green)", fontSize: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", marginBottom: "0.875rem" }}>
          <CheckCircle size={13} />MT5 account connected successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

        {/* Broker */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label className="font-mono" style={labelStyle}>Broker</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {(["xm", "exness"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleBrokerChange(b)}
                style={{
                  padding: "0.625rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: broker === b ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: broker === b ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.15)",
                  background: broker === b ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                  color: broker === b ? "#D4AF37" : "var(--text-secondary)",
                }}
              >
                {b === "xm" ? "XM" : "Exness"}
              </button>
            ))}
          </div>
        </div>

        {/* MT5 Login */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label className="font-mono" style={labelStyle}>MT5 Login (Account Number)</label>
          <input
            type="text"
            value={mt5Login}
            onChange={(e) => setMt5Login(e.target.value)}
            placeholder="e.g. 12345678"
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
          />
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
            Found in your {broker === "xm" ? "XM Members Area" : "Exness Personal Area"} · MT5 accounts
          </p>
        </div>

        {/* Investor Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label className="font-mono" style={labelStyle}>Investor Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={investorPassword}
              onChange={(e) => setInvestorPassword(e.target.value)}
              placeholder="Investor (read-only) password"
              required
              style={{ ...inputStyle, paddingRight: "2.75rem" }}
              onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.25rem" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "0.625rem", padding: "0.5rem 0.75rem" }}>
            <CheckCircle size={11} style={{ color: "#D4AF37", flexShrink: 0, marginTop: "0.15rem" }} />
            <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#D4AF37" }}>Read-only access.</strong> Investor password cannot withdraw funds or place trades · it only allows monitoring your account.
            </p>
          </div>
        </div>

        {/* Server */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label className="font-mono" style={labelStyle}>MT5 Server</label>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            required
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
          >
            <option value="">Select server…</option>
            {SERVERS[broker].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <p style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
            Found in MT5 · File · Open Account · server name
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold"
          style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.7 : 1, marginTop: "0.25rem" }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Saving…" : isConnected ? "Update Connection" : "Connect MT5 Account"}
        </button>
      </form>
    </div>
  );
}
