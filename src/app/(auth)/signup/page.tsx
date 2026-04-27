"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoldGradientBg } from "@/components/ui/elegant-gold-pattern";
import GlassFilter from "@/components/landing/GlassFilter";

const ArtemisLogo = () => (
  <img src="/logo.png" alt="Artemis" width={32} height={32} style={{ objectFit: "contain" }} />
);

export default function SignupPage() {
  const router = useRouter();
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
        emailRedirectTo: `${window.location.origin}/dashboard`,
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

  if (success) {
    return (
      <GoldGradientBg>
        <GlassFilter />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div className="bento" style={{ textAlign: "center", maxWidth: "26rem", width: "100%", borderRadius: "1.25rem", padding: "2.5rem 2rem" }}>
            <CheckCircle size={52} style={{ color: "#D4AF37", margin: "0 auto 1.25rem" }} />
            <h2 className="font-display" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
              Check your email
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              We sent a verification link to{" "}
              <strong style={{ color: "var(--text-primary)" }}>{email}</strong>.
              Click it to activate your account.
            </p>
            <Link
              href="/login"
              style={{ display: "inline-block", marginTop: "1.5rem", color: "#D4AF37", fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}
            >
              Back to login →
            </Link>
          </div>
        </div>
      </GoldGradientBg>
    );
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
              Create account
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
              Start trading smarter in minutes
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSignup}
            className="bento"
            style={{ borderRadius: "1.25rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {error && (
              <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171", fontSize: "0.8125rem", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
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
                  minLength={8}
                  placeholder="Min. 8 characters"
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
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#D4AF37", fontWeight: 600, textDecoration: "none" }}>
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </GoldGradientBg>
  );
}
