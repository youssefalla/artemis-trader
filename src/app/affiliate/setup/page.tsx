"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

export default function AffiliateSetupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [password,        setPassword]        = useState("");
  const [confirm,         setConfirm]         = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [done,            setDone]            = useState(false);

  const strength = password.length === 0 ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const strengthLabel = ["", "Too short", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#f87171", "#fbbf24", "#34d399", "#D4AF37"][strength];

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => router.push("/affiliate/dashboard"), 2000);
  }

  // tokens
  const cardBg     = dark ? "rgba(255,255,255,0.04)"  : "rgba(255,255,255,0.72)";
  const cardBorder = dark ? "rgba(212,175,55,0.22)"   : "rgba(140,95,0,0.25)";
  const cardShadow = dark
    ? "0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)"
    : "0 8px 48px rgba(100,70,0,0.12), 0 2px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)";
  const headColor  = dark ? "#ffffff"                  : "#1a1000";
  const subColor   = dark ? "rgba(255,255,255,0.45)"   : "rgba(0,0,0,0.45)";
  const labelColor = dark ? "rgba(255,255,255,0.50)"   : "rgba(0,0,0,0.50)";
  const textColor  = dark ? "#ffffff"                  : "#1a1000";
  const inputBg    = dark ? "rgba(255,255,255,0.07)"   : "rgba(255,255,255,0.80)";
  const inputBorder= dark ? "rgba(255,255,255,0.15)"   : "rgba(140,95,0,0.20)";
  const inputFocus = dark ? "rgba(212,175,55,0.08)"    : "rgba(212,175,55,0.07)";
  const eyeColor   = dark ? "rgba(255,255,255,0.35)"   : "rgba(0,0,0,0.30)";
  const bgColor    = dark ? "#000000"                  : "#f5f0d8";

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={52} color="#34d399" style={{ marginBottom: "1rem" }} />
          <p style={{ fontSize: "1.25rem", fontWeight: 700, color: headColor, margin: 0 }}>Password set!</p>
          <p style={{ color: subColor, marginTop: "0.5rem", fontSize: "0.9rem" }}>Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "26rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <img src="/logo.png" alt="Artemis" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em", color: headColor }}>
              ARTEMIS<span style={{ color: "#D4AF37" }}>·</span>TRADER
            </span>
          </div>
          <div style={{ display: "inline-block", padding: "0.35rem 0.875rem", borderRadius: "9999px", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.30)", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", textTransform: "uppercase" }}>✦ Affiliate Program</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: headColor, margin: 0, letterSpacing: "-0.02em" }}>Set Your Password</h1>
          <p style={{ color: subColor, fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Choose a strong password to secure your affiliate account.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSetPassword}
          style={{ background: cardBg, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: `1px solid ${cardBorder}`, borderRadius: "1.5rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: cardShadow }}>

          {error && (
            <div style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)", color: "#ef4444", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)} required placeholder="••••••••••••"
                style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 3rem 0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocus; }}
                onBlur={e  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: eyeColor, padding: 0, display: "flex" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <div style={{ flex: 1, display: "flex", gap: "3px" }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{ flex: 1, height: "3px", borderRadius: "9999px", background: n <= strength ? strengthColor : "rgba(255,255,255,0.10)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.72rem", color: strengthColor, fontWeight: 600, minWidth: "55px" }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"} value={confirm}
                onChange={e => setConfirm(e.target.value)} required placeholder="••••••••••••"
                style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${confirm && confirm !== password ? "rgba(220,38,38,0.50)" : confirm && confirm === password ? "rgba(52,211,153,0.50)" : inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 3rem 0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
                onFocus={e => { e.target.style.background = inputFocus; }}
                onBlur={e  => { e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: eyeColor, padding: 0, display: "flex" }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirm && confirm === password && (
              <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>✓ Passwords match</span>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #D4AF37 100%)", border: "none", borderRadius: "0.875rem", padding: "0.9375rem", fontSize: "1rem", fontWeight: 700, color: "#0a0700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.15s", letterSpacing: "0.04em", boxShadow: "0 4px 24px rgba(212,175,55,0.40)" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Saving…" : "Set Password & Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
