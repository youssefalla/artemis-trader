"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function InviteClient() {
  const [email,      setEmail]      = useState("");
  const [code,       setCode]       = useState("");
  const [commission, setCommission] = useState("20");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setResult(null);
    const res = await fetch("/api/admin/invite-affiliate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: code.toUpperCase(), commission: parseFloat(commission) }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setResult({ ok: true, msg: `✓ Affiliate created — login credentials sent to ${email} (code: ${code.toUpperCase()})` });
      setEmail(""); setCode(""); setCommission("20");
    } else {
      setResult({ ok: false, msg: data.error ?? data.warning ?? "Something went wrong" });
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem 1rem", borderRadius: "0.875rem",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
    color: "var(--text-primary)", fontSize: "0.9rem", outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div className="bento" style={{ borderRadius: "1.25rem", padding: "1.5rem", border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.03)" }}>
      <p className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#D4AF37", marginBottom: "1.25rem" }}>
        ✦ Invite New Affiliate / Influencer
      </p>

      {result && (
        <div style={{ marginBottom: "1rem", padding: "0.875rem 1rem", borderRadius: "0.875rem",
          background: result.ok ? "rgba(5,150,105,0.10)" : "rgba(220,38,38,0.08)",
          border: `1px solid ${result.ok ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)"}`,
          color: result.ok ? "#34d399" : "#f87171", fontSize: "0.875rem", fontWeight: 600 }}>
          {result.msg}
        </div>
      )}

      <form onSubmit={handleInvite} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px auto", gap: "0.875rem", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Influencer Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="influencer@gmail.com"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "#D4AF37")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.14)")} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Referral Code</label>
          <input type="text" required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ADAM20"
            style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em" }}
            onFocus={e => (e.target.style.borderColor = "#D4AF37")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.14)")} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Commission %</label>
          <input type="number" required min={1} max={100} value={commission} onChange={e => setCommission(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "#D4AF37")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.14)")} />
        </div>

        <button type="submit" disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.875rem", border: "none",
            background: "linear-gradient(135deg,#D4AF37,#f0d060)", color: "#0a0700", fontWeight: 700, fontSize: "0.875rem",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(212,175,55,0.30)" }}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {loading ? "Sending…" : "Send Invite"}
        </button>
      </form>
    </div>
  );
}
