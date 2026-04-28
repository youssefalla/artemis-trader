"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

function SpaceBg({ dark }: { dark: boolean }) {
  const r = dark ? "212,175,55" : "160,110,0";
  const w = dark ? "255,230,80" : "190,140,10";
  const arc = dark ? `rgba(212,175,55,0.55)` : `rgba(140,95,0,0.50)`;

  const wingCore  = dark ? 0.55 : 0.30;
  const wingMid   = dark ? 0.25 : 0.14;
  const wingEdge  = dark ? 0.04 : 0.02;
  const wingOuter = dark ? 0.18 : 0.10;
  const wingGlow  = dark ? 0.08 : 0.04;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, background: dark ? "#000000" : "#f5f0d8" }}>

      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from 0deg at 50% 57%, transparent 0deg, rgba(${r},${wingEdge}) 295deg, rgba(${r},${wingMid}) 306deg, rgba(${w},${wingCore}) 315deg, rgba(${r},${wingMid}) 324deg, rgba(${r},${wingEdge}) 335deg, transparent 360deg)`, filter: "blur(18px)" }} />
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from 0deg at 50% 57%, transparent 0deg, rgba(${r},${wingEdge}) 25deg, rgba(${r},${wingMid}) 36deg, rgba(${w},${wingCore}) 45deg, rgba(${r},${wingMid}) 54deg, rgba(${r},${wingEdge}) 65deg, transparent 360deg)`, filter: "blur(18px)" }} />
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from 0deg at 50% 57%, transparent 0deg, rgba(${r},${wingGlow}) 280deg, rgba(${r},${wingOuter}) 315deg, rgba(${r},${wingGlow}) 350deg, transparent 360deg)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from 0deg at 50% 57%, transparent 0deg, rgba(${r},${wingGlow}) 10deg, rgba(${r},${wingOuter}) 45deg, rgba(${r},${wingGlow}) 80deg, transparent 360deg)`, filter: "blur(40px)" }} />

      <div style={{ position: "absolute", left: "50%", top: "57%", width: "220vw", height: "220vw", transform: "translateX(-50%)", borderRadius: "50%", border: `1px solid ${arc}`, boxShadow: dark ? `0 0 12px rgba(212,175,55,0.45), 0 0 35px rgba(212,175,55,0.22), 0 0 80px rgba(212,175,55,0.08)` : `0 0 12px rgba(140,95,0,0.35), 0 0 35px rgba(140,95,0,0.15), 0 0 80px rgba(140,95,0,0.06)` }} />
      <div style={{ position: "absolute", left: "50%", top: "57%", width: "220vw", height: "220vw", transform: "translateX(-50%)", borderRadius: "50%", boxShadow: dark ? `inset 0 3px 40px rgba(212,175,55,0.18), inset 0 1px 80px rgba(255,220,60,0.08)` : `inset 0 3px 40px rgba(160,110,0,0.12), inset 0 1px 80px rgba(190,140,10,0.06)` }} />

      <div style={{ position: "absolute", left: "50%", top: "57%", width: "320px", height: "320px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: dark ? `radial-gradient(circle, rgba(255,255,220,1) 0%, rgba(255,235,90,0.85) 4%, rgba(212,175,55,0.55) 12%, rgba(212,175,55,0.18) 35%, transparent 65%)` : `radial-gradient(circle, rgba(255,240,150,0.95) 0%, rgba(210,160,20,0.75) 4%, rgba(160,110,0,0.40) 12%, rgba(160,110,0,0.10) 35%, transparent 65%)`, filter: "blur(3px)" }} />
      <div style={{ position: "absolute", left: "50%", top: "57%", width: "600px", height: "600px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: dark ? `radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)` : `radial-gradient(circle, rgba(160,110,0,0.14) 0%, rgba(160,110,0,0.04) 40%, transparent 70%)`, filter: "blur(20px)" }} />
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [fullName, setFullName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

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

  const cardBg      = dark ? "rgba(255,255,255,0.05)"  : "rgba(255,255,255,0.68)";
  const cardBorder  = dark ? "rgba(212,175,55,0.25)"   : "rgba(140,95,0,0.28)";
  const cardShadow  = dark
    ? "0 8px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 8px 48px rgba(100,70,0,0.14), 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)";
  const headingColor = dark ? "#ffffff"                : "#1a1000";
  const subColor     = dark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.45)";
  const labelColor   = dark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.50)";
  const textColor    = dark ? "#ffffff"                : "#1a1000";
  const inputBg      = dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.80)";
  const inputBorder  = dark ? "rgba(255,255,255,0.15)" : "rgba(140,95,0,0.20)";
  const inputFocusBg = dark ? "rgba(212,175,55,0.08)"  : "rgba(212,175,55,0.07)";
  const eyeColor     = dark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.35)";

  const glassStyle: React.CSSProperties = {
    background: cardBg, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
    border: `1px solid ${cardBorder}`, borderRadius: "1.5rem", padding: "2rem",
    display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: cardShadow,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: "0.875rem", padding: "0.8125rem 1rem",
    fontSize: "0.9rem", color: textColor, outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  if (success) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
        <SpaceBg dark={dark} />
        <div style={{ ...glassStyle, position: "relative", zIndex: 1, textAlign: "center", maxWidth: "26rem", width: "100%", padding: "2.5rem 2rem" }}>
          <CheckCircle size={52} style={{ color: "#D4AF37", margin: "0 auto 1.25rem" }} />
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: headingColor, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Check your email</h2>
          <p style={{ color: subColor, fontSize: "0.9rem", lineHeight: 1.7 }}>
            We sent a verification link to <strong style={{ color: headingColor }}>{email}</strong>. Click it to activate your account.
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

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            <img src="/logo.png" alt="Artemis" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em", color: headingColor }}>
              ARTEMIS<span style={{ color: "#D4AF37" }}>·</span>TRADER
            </span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: headingColor, margin: 0, letterSpacing: "-0.02em" }}>Create Account</h1>
          <p style={{ color: subColor, fontSize: "0.875rem", marginTop: "0.35rem" }}>Start trading smarter in minutes</p>
        </div>

        <form onSubmit={handleSignup} style={glassStyle}>
          {error && (
            <div style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)", color: "#ef4444", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters"
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
                onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: eyeColor, padding: 0, display: "flex" }}>
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
