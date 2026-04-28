"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

function SpaceBg({ dark }: { dark: boolean }) {
  // Dark: pure black sky, bright gold glow
  // Light: warm cream sky, deeper amber rays
  const r = dark ? "212,175,55"  : "160,110,0";    // gold base
  const w = dark ? "255,230,80"  : "190,140,10";   // bright centre
  const arc = dark
    ? `rgba(212,175,55,0.30)` : `rgba(140,95,0,0.50)`;

  const wingCore  = dark ? 0.22 : 0.30;
  const wingMid   = dark ? 0.10 : 0.14;
  const wingEdge  = dark ? 0.01 : 0.02;
  const wingOuter = dark ? 0.07 : 0.10;
  const wingGlow  = dark ? 0.03 : 0.04;

  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
      background: dark ? "#000000" : "#f5f0d8",
    }}>
      <style>{`
        @keyframes wingBreathL {
          0%, 100% { opacity: 0.6; transform: scaleY(0.97); }
          50%       { opacity: 1;   transform: scaleY(1.03); }
        }
        @keyframes wingBreathR {
          0%, 100% { opacity: 1;   transform: scaleY(1.03); }
          50%       { opacity: 0.6; transform: scaleY(0.97); }
        }
        @keyframes wingGlowPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
        @keyframes arcFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-18px); }
        }
      `}</style>

      {/* Left wing */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(${r},${wingEdge}) 295deg,
          rgba(${r},${wingMid}) 306deg,
          rgba(${w},${wingCore}) 315deg,
          rgba(${r},${wingMid}) 324deg,
          rgba(${r},${wingEdge}) 335deg,
          transparent 360deg)`,
        filter: "blur(18px)",
        animation: "wingBreathL 6s ease-in-out infinite",
        transformOrigin: "50% 57%",
      }} />

      {/* Right wing */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(${r},${wingEdge}) 25deg,
          rgba(${r},${wingMid}) 36deg,
          rgba(${w},${wingCore}) 45deg,
          rgba(${r},${wingMid}) 54deg,
          rgba(${r},${wingEdge}) 65deg,
          transparent 360deg)`,
        filter: "blur(18px)",
        animation: "wingBreathR 6s ease-in-out infinite",
        transformOrigin: "50% 57%",
      }} />

      {/* Soft outer spread — left */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(${r},${wingGlow}) 280deg,
          rgba(${r},${wingOuter}) 315deg,
          rgba(${r},${wingGlow}) 350deg,
          transparent 360deg)`,
        filter: "blur(40px)",
        animation: "wingGlowPulse 6s ease-in-out infinite",
      }} />

      {/* Soft outer spread — right */}
      <div style={{
        position: "absolute", inset: 0,
        background: `conic-gradient(from 0deg at 50% 57%,
          transparent 0deg,
          rgba(${r},${wingGlow}) 10deg,
          rgba(${r},${wingOuter}) 45deg,
          rgba(${r},${wingGlow}) 80deg,
          transparent 360deg)`,
        filter: "blur(40px)",
        animation: "wingGlowPulse 6s ease-in-out infinite 3s",
      }} />

      {/* Planet arc */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "220vw", height: "220vw",
        transform: "translateX(-50%)", borderRadius: "50%",
        border: `1px solid ${arc}`,
        boxShadow: dark
          ? `0 0 8px rgba(212,175,55,0.22), 0 0 25px rgba(212,175,55,0.10), 0 0 60px rgba(212,175,55,0.04)`
          : `0 0 12px rgba(140,95,0,0.35), 0 0 35px rgba(140,95,0,0.15), 0 0 80px rgba(140,95,0,0.06)`,
        animation: "arcFloat 8s ease-in-out infinite",
      }} />

      {/* Atmosphere glow along arc */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "220vw", height: "220vw",
        transform: "translateX(-50%)", borderRadius: "50%",
        boxShadow: dark
          ? `inset 0 3px 30px rgba(212,175,55,0.08), inset 0 1px 60px rgba(255,220,60,0.04)`
          : `inset 0 3px 40px rgba(160,110,0,0.12), inset 0 1px 80px rgba(190,140,10,0.06)`,
        animation: "arcFloat 8s ease-in-out infinite",
      }} />

      {/* Central burst */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "320px", height: "320px",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        background: dark
          ? `radial-gradient(circle, rgba(255,255,220,0.85) 0%, rgba(255,235,90,0.55) 4%, rgba(212,175,55,0.25) 12%, rgba(212,175,55,0.07) 35%, transparent 65%)`
          : `radial-gradient(circle, rgba(255,240,150,0.95) 0%, rgba(210,160,20,0.75) 4%, rgba(160,110,0,0.40) 12%, rgba(160,110,0,0.10) 35%, transparent 65%)`,
        filter: "blur(3px)",
      }} />

      {/* Outer halo */}
      <div style={{
        position: "absolute", left: "50%", top: "57%",
        width: "600px", height: "600px",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        background: dark
          ? `radial-gradient(circle, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)`
          : `radial-gradient(circle, rgba(160,110,0,0.14) 0%, rgba(160,110,0,0.04) 40%, transparent 70%)`,
        filter: "blur(20px)",
      }} />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified_affiliate")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.is_verified_affiliate ? "/affiliate/dashboard" : "/dashboard");
    router.refresh();
  }

  // ── Dark tokens ──────────────────────────────────────────────
  const cardBg      = dark ? "rgba(255,255,255,0.05)"  : "rgba(255,255,255,0.68)";
  const cardBorder  = dark ? "rgba(212,175,55,0.25)"   : "rgba(140,95,0,0.28)";
  const cardShadow  = dark
    ? "0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 8px 48px rgba(100,70,0,0.14), 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)";
  const headingColor = dark ? "#ffffff"                 : "#1a1000";
  const subColor     = dark ? "rgba(255,255,255,0.50)"  : "rgba(0,0,0,0.45)";
  const labelColor   = dark ? "rgba(255,255,255,0.50)"  : "rgba(0,0,0,0.50)";
  const textColor    = dark ? "#ffffff"                 : "#1a1000";
  const inputBg      = dark ? "rgba(255,255,255,0.07)"  : "rgba(255,255,255,0.80)";
  const inputBorder  = dark ? "rgba(255,255,255,0.15)"  : "rgba(140,95,0,0.20)";
  const inputFocusBg = dark ? "rgba(212,175,55,0.08)"   : "rgba(212,175,55,0.07)";
  const eyeColor     = dark ? "rgba(255,255,255,0.40)"  : "rgba(0,0,0,0.35)";

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
      <SpaceBg dark={dark} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "26rem" }}>

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            <img src="/logo.png" alt="Artemis" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em", color: headingColor }}>
              ARTEMIS<span style={{ color: "#D4AF37" }}>·</span>TRADER
            </span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: headingColor, margin: 0, letterSpacing: "-0.02em" }}>
            Welcome Back
          </h1>
          <p style={{ color: subColor, fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Log in to access your dashboard
          </p>
        </div>

        {/* Glass card */}
        <form
          onSubmit={handleLogin}
          style={{ background: cardBg, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: `1px solid ${cardBorder}`, borderRadius: "1.5rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: cardShadow }}
        >
          {error && (
            <div style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)", color: "#ef4444", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              Email address
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com"
              style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••••••••"
                style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 3rem 0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
                onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: eyeColor, padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", color: subColor, cursor: "pointer" }}>Forget Password ?</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #D4AF37 100%)", border: "none", borderRadius: "0.875rem", padding: "0.9375rem", fontSize: "1rem", fontWeight: 700, color: "#0a0700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.15s", letterSpacing: "0.04em", boxShadow: "0 4px 24px rgba(212,175,55,0.40)" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in…" : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: subColor, margin: 0 }}>
            Are You New Member?{" "}
            <Link href="/signup" style={{ color: "#D4AF37", fontWeight: 700, textDecoration: "none" }}>Sign UP</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
