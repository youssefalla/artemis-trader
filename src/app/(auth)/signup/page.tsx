"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

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
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const bg = dark ? "#08070a" : "#faf8f0";
  const orb1 = dark
    ? "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)"
    : "radial-gradient(circle, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.10) 40%, transparent 70%)";
  const orb2 = dark
    ? "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%)"
    : "radial-gradient(circle, rgba(212,175,55,0.20) 0%, transparent 65%)";
  const dotColor = dark ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.30)";

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)";
  const cardBorder = dark ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.35)";
  const cardShadow = dark
    ? "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)"
    : "0 8px 48px rgba(212,175,55,0.12), 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";

  const headingColor = dark ? "#ffffff" : "#1a1200";
  const subColor = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const labelColor = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.50)";
  const textColor = dark ? "#ffffff" : "#1a1200";
  const inputBg = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.80)";
  const inputBorder = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
  const inputFocusBg = dark ? "rgba(212,175,55,0.06)" : "rgba(212,175,55,0.05)";
  const eyeColor = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  const bgLayer = (
    <>
      <div style={{ position: "fixed", top: "-15%", left: "50%", transform: "translateX(-50%)", width: "70vw", height: "70vw", maxWidth: "700px", maxHeight: "700px", borderRadius: "50%", background: orb1, filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "50vw", height: "50vw", maxWidth: "500px", maxHeight: "500px", borderRadius: "50%", background: orb2, filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`, backgroundSize: "28px 28px", opacity: 0.5 }} />
    </>
  );

  const glassCardStyle: React.CSSProperties = {
    background: cardBg,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
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
    fontSize: "0.9rem", color: textColor, outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  if (success) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
        {bgLayer}
        <div style={{ ...glassCardStyle, position: "relative", zIndex: 1, textAlign: "center", maxWidth: "26rem", width: "100%", padding: "2.5rem 2rem" }}>
          <CheckCircle size={52} style={{ color: "#D4AF37", margin: "0 auto 1.25rem" }} />
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: headingColor, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Check your email
          </h2>
          <p style={{ color: subColor, fontSize: "0.9rem", lineHeight: 1.7 }}>
            We sent a verification link to{" "}
            <strong style={{ color: headingColor }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/login" style={{ display: "inline-block", marginTop: "1.5rem", color: "#D4AF37", fontWeight: 700, textDecoration: "none", fontSize: "0.875rem" }}>
            Back to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
      {bgLayer}

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
            Create Account
          </h1>
          <p style={{ color: subColor, fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Start trading smarter in minutes
          </p>
        </div>

        {/* Glass form card */}
        <form onSubmit={handleSignup} style={glassCardStyle}>
          {error && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#ef4444", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Full Name</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Email address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: labelColor }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters"
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: eyeColor, padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #D4AF37 100%)", border: "none", borderRadius: "0.875rem", padding: "0.9375rem", fontSize: "1rem", fontWeight: 700, color: "#0a0700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.15s", letterSpacing: "0.04em", boxShadow: "0 4px 24px rgba(212,175,55,0.35)" }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.transform = "translateY(-1px)"); }}
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
