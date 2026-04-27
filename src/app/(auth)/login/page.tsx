"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

const ArtemisLogo = () => (
  <img src="/logo.png" alt="Artemis" width={32} height={32} style={{ objectFit: "contain" }} />
);

export default function LoginPage() {
  const router = useRouter();
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

  return (
    <GoldGradientBg>
      <GlassFilter />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "26rem" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "1.5rem" }}>
              <ArtemisLogo />
              <span className="font-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                Artemis<span style={{ color: "#D4AF37" }}>·</span>Trader
              </span>
            </Link>
            <h1 className="font-display" style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--text-primary)", marginTop: "0.5rem" }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
              Log in to access your dashboard
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleLogin}
            className="bento"
            style={{ borderRadius: "1.25rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {error && (
              <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.60)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(255,255,255,0.60)",
                    borderRadius: "0.75rem",
                    padding: "0.75rem 3rem 0.75rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.60)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 0, display: "flex" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: "100%", borderRadius: "0.75rem", padding: "0.875rem", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Logging in…" : "Log In"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "#D4AF37", fontWeight: 600, textDecoration: "none" }}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </GoldGradientBg>
  );
}
