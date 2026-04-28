"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

function SpaceBg({ dark }: { dark: boolean }) {
  const intensity = dark ? 1 : 0.75;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, background: dark ? "#000" : "#0a0703" }}>

      {/* Left wing */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(212,175,55,${0.04 * intensity}) 295deg,
          rgba(212,175,55,${0.25 * intensity}) 306deg,
          rgba(255,230,80,${0.55 * intensity}) 315deg,
          rgba(212,175,55,${0.25 * intensity}) 324deg,
          rgba(212,175,55,${0.04 * intensity}) 335deg,
          transparent 360deg
        )`,
        filter: "blur(18px)",
      }} />
      {/* Right wing */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(212,175,55,${0.04 * intensity}) 25deg,
          rgba(212,175,55,${0.25 * intensity}) 36deg,
          rgba(255,230,80,${0.55 * intensity}) 45deg,
          rgba(212,175,55,${0.25 * intensity}) 54deg,
          rgba(212,175,55,${0.04 * intensity}) 65deg,
          transparent 360deg
        )`,
        filter: "blur(18px)",
      }} />

      {/* Soft outer glow on wings */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(212,175,55,${0.08 * intensity}) 280deg,
          rgba(212,175,55,${0.18 * intensity}) 315deg,
          rgba(212,175,55,${0.08 * intensity}) 350deg,
          transparent 360deg
        )`,
        filter: "blur(40px)", opacity: 0.9,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(212,175,55,${0.08 * intensity}) 10deg,
          rgba(212,175,55,${0.18 * intensity}) 45deg,
          rgba(212,175,55,${0.08 * intensity}) 80deg,
          transparent 360deg
        )`,
        filter: "blur(40px)", opacity: 0.9,
      }} />

      {/* Planet arc */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "220vw", height: "220vw",
        transform: "translateX(-50%)",
        borderRadius: "50%",
        border: `1px solid rgba(212,175,55,${0.55 * intensity})`,
        boxShadow: [
          `0 0 12px rgba(212,175,55,${0.45 * intensity})`,
          `0 0 35px rgba(212,175,55,${0.22 * intensity})`,
          `0 0 80px rgba(212,175,55,${0.08 * intensity})`,
        ].join(", "),
      }} />

      {/* Atmosphere strip */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "220vw", height: "220vw",
        transform: "translateX(-50%)",
        borderRadius: "50%",
        boxShadow: `inset 0 3px 40px rgba(212,175,55,${0.18 * intensity}), inset 0 1px 80px rgba(255,220,60,${0.08 * intensity})`,
      }} />

      {/* Central burst */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "320px", height: "320px",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle,
          rgba(255,255,220,${1 * intensity}) 0%,
          rgba(255,235,90,${0.85 * intensity}) 4%,
          rgba(212,175,55,${0.55 * intensity}) 12%,
          rgba(212,175,55,${0.18 * intensity}) 35%,
          transparent 65%
        )`,
        filter: "blur(3px)",
      }} />

      {/* Outer halo */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "600px", height: "600px",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle,
          rgba(212,175,55,${0.22 * intensity}) 0%,
          rgba(212,175,55,${0.06 * intensity}) 40%,
          transparent 70%
        )`,
        filter: "blur(20px)",
      }} />
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  const cardBg     = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)";
  const cardBorder = dark ? "rgba(212,175,55,0.25)"  : "rgba(212,175,55,0.40)";
  const cardShadow = dark
    ? "0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)";
  const subColor    = dark ? "rgba(255,255,255,0.5)"  : "rgba(255,255,255,0.6)";
  const labelColor  = dark ? "rgba(255,255,255,0.5)"  : "rgba(255,255,255,0.55)";
  const inputBg     = dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.10)";
  const inputBorder = dark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.22)";
  const inputFocusBg = "rgba(212,175,55,0.08)";

  const glassStyle: React.CSSProperties = {
    background: cardBg,
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: `1px solid ${cardBorder}`,
    borderRadius: "1.5rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    boxShadow: cardShadow,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: "0.875rem", padding: "0.8125rem 1rem",
    fontSize: "0.9rem", color: "#ffffff", outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  if (success) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
        <SpaceBg dark={dark} />
        <div style={{ ...glassStyle, position: "relative", zIndex: 1, textAlign: "center", maxWidth: "26rem", width: "100%", padding: "2.5rem 2rem" }}>
          <CheckCircle size={52} style={{ color: "#D4AF37", margin: "0 auto 1.25rem" }} />
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Check your email</h2>
          <p style={{ color: subColor, fontSize: "0.9rem", lineHeight: 1.7 }}>
            We sent a verification link to <strong style={{ color: "#ffffff" }}>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login" style={{ display: "inline-block", marginTop: "1.5rem", color: "#D4AF37", fontWeight: 700, textDecoration: "none", fontSize: "0.875rem" }}>
            Back to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
      <SpaceBg dark={dark} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "26rem" }}>

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            <img src="/logo.png" alt="Artemis" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em", color: "#ffffff" }}>
              ARTEMIS<span style={{ color: "#D4AF37" }}>·</span>TRADER
            </span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>Create Account</h1>
          <p style={{ color: subColor, fontSize: "0.875rem", marginTop: "0.35rem" }}>Start trading smarter in minutes</p>
        </div>

        {/* Glass card */}
        <form onSubmit={handleSignup} style={glassStyle}>
          {error && (
            <div style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.35)", color: "#f87171", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters"
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #D4AF37 100%)", border: "none", borderRadius: "0.875rem", padding: "0.9375rem", fontSize: "1rem", fontWeight: 700, color: "#0a0700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.15s", letterSpacing: "0.04em", boxShadow: "0 4px 24px rgba(212,175,55,0.40)" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: subColor, margin: 0 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#D4AF37", fontWeight: 700, textDecoration: "none" }}>Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
