"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>

      {/* Glow — top center */}
      <div style={{
        position: "fixed", top: "-15%", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "70vw", maxWidth: "700px", maxHeight: "700px",
        borderRadius: "50%", background: orb1, filter: "blur(40px)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Glow — bottom right */}
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%",
        width: "50vw", height: "50vw", maxWidth: "500px", maxHeight: "500px",
        borderRadius: "50%", background: orb2, filter: "blur(50px)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Dot grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
        backgroundSize: "28px 28px", opacity: 0.5,
      }} />

      {/* Content */}
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
          style={{
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
          }}
        >
          {error && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#ef4444", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
              onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: labelColor }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••••"
                style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 3rem 0.8125rem 1rem", fontSize: "0.9rem", color: textColor, outline: "none", transition: "border-color 0.2s, background 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4AF37"; e.target.style.background = inputFocusBg; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)", padding: 0, display: "flex" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", color: subColor, cursor: "pointer" }}>
                Forget Password ?
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #D4AF37 0%, #f0d060 50%, #D4AF37 100%)",
              border: "none",
              borderRadius: "0.875rem",
              padding: "0.9375rem",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0a0700",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: loading ? 0.75 : 1,
              transition: "opacity 0.2s, transform 0.15s",
              letterSpacing: "0.04em",
              boxShadow: "0 4px 24px rgba(212,175,55,0.35)",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.transform = "translateY(-1px)"); }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in…" : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: subColor, margin: 0 }}>
            Are You New Member?{" "}
            <Link href="/signup" style={{ color: "#D4AF37", fontWeight: 700, textDecoration: "none" }}>
              Sign UP
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
