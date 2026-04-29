"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function AffiliateBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
      background: "#f0f7f0",
    }}>
      <style>{`
        @keyframes glowPulseG {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes glowPulseA {
          0%, 100% { opacity: 0.85; transform: scale(1.06); }
          50%       { opacity: 0.5; transform: scale(1); }
        }
        @keyframes arcFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-14px); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      {/* Green glow — left */}
      <div style={{
        position: "absolute", left: "-10%", top: "20%",
        width: "60vw", height: "60vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.28) 0%, rgba(34,197,94,0.10) 40%, transparent 70%)",
        filter: "blur(60px)",
        animation: "glowPulseG 7s ease-in-out infinite",
      }} />

      {/* Gold glow — right */}
      <div style={{
        position: "absolute", right: "-10%", top: "10%",
        width: "55vw", height: "55vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.10) 40%, transparent 70%)",
        filter: "blur(60px)",
        animation: "glowPulseA 7s ease-in-out infinite",
      }} />

      {/* Green glow — bottom right */}
      <div style={{
        position: "absolute", right: "5%", bottom: "-5%",
        width: "45vw", height: "45vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.06) 50%, transparent 70%)",
        filter: "blur(50px)",
        animation: "glowPulseG 9s ease-in-out infinite 2s",
      }} />

      {/* Gold glow — bottom left */}
      <div style={{
        position: "absolute", left: "5%", bottom: "5%",
        width: "40vw", height: "40vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,208,96,0.20) 0%, rgba(212,175,55,0.06) 50%, transparent 70%)",
        filter: "blur(50px)",
        animation: "glowPulseA 9s ease-in-out infinite 1s",
      }} />

      {/* Arc circle */}
      <div style={{
        position: "absolute", left: "50%", top: "58%",
        width: "200vw", height: "200vw",
        transform: "translateX(-50%)", borderRadius: "50%",
        border: "1px solid rgba(34,197,94,0.18)",
        boxShadow: "0 0 30px rgba(34,197,94,0.08), 0 0 80px rgba(212,175,55,0.06)",
        animation: "arcFloat 10s ease-in-out infinite",
      }} />

      {/* Center shimmer */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: "500px", height: "500px",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.10) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)",
        filter: "blur(30px)",
        animation: "shimmer 5s ease-in-out infinite",
      }} />
    </div>
  );
}

export default function AffiliateLoginPage() {
  const router = useRouter();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified_affiliate")
      .eq("id", data.user.id)
      .single();

    if (!profile?.is_verified_affiliate) {
      await supabase.auth.signOut();
      setError("Access denied — this portal is for Artemis affiliates only.");
      setLoading(false);
      return;
    }

    router.push("/affiliate/dashboard");
    router.refresh();
  }

  const inputBg     = "rgba(255,255,255,0.75)";
  const inputBorder = "rgba(34,197,94,0.25)";

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
      <AffiliateBg />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "26rem" }}>

        {/* Logo + badge */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1rem" }}>
            <img src="/logo.png" alt="Artemis" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em", color: "#1a2e1a" }}>
              ARTEMIS<span style={{ color: "#D4AF37" }}>·</span>TRADER
            </span>
          </Link>

          {/* Partner badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(34,197,94,0.35)", borderRadius: "2rem", padding: "0.35rem 1rem", marginBottom: "1rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#15803d" }}>Affiliate & Partner Portal</span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a2e1a", margin: 0, letterSpacing: "-0.02em" }}>
            Partner Access
          </h1>
          <p style={{ color: "rgba(0,0,0,0.45)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Log in to your affiliate dashboard
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "1.5rem", padding: "2rem",
            display: "flex", flexDirection: "column", gap: "1.25rem",
            boxShadow: "0 8px 48px rgba(34,197,94,0.10), 0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)",
          }}
        >
          {error && (
            <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(0,0,0,0.50)" }}>
              Email Address
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 1rem", fontSize: "0.9rem", color: "#1a2e1a", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => { e.target.style.borderColor = "#22c55e"; }}
              onBlur={(e)  => { e.target.style.borderColor = inputBorder; }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(0,0,0,0.50)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••••••••"
                style={{ width: "100%", boxSizing: "border-box" as const, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: "0.875rem", padding: "0.8125rem 3rem 0.8125rem 1rem", fontSize: "0.9rem", color: "#1a2e1a", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = "#22c55e"; }}
                onBlur={(e)  => { e.target.style.borderColor = inputBorder; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.35)", padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #D4AF37 100%)",
              border: "none", borderRadius: "0.875rem", padding: "0.9375rem",
              fontSize: "1rem", fontWeight: 700, color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.15s",
              letterSpacing: "0.04em",
              boxShadow: "0 4px 24px rgba(34,197,94,0.35)",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in…" : "Access Dashboard"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(0,0,0,0.35)", margin: 0 }}>
            Not an affiliate?{" "}
            <Link href="/login" style={{ color: "#D4AF37", fontWeight: 700, textDecoration: "none" }}>Regular Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
