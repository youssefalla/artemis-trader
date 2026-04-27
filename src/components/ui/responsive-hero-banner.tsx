"use client";

import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";
import { HoverButtonLink } from "@/components/ui/hover-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavLink {
  label: string;
  href: string;
}

interface ResponsiveHeroBannerProps {
  navLinks?: NavLink[];
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function ResponsiveHeroBanner({
  navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  badgeText = "XM MT5 Integration",
  badgeLabel = "Live",
  title = "Trade Smarter,",
  titleLine2 = "Earn More.",
  description = "Connect your XM MT5 account and let Artemis handle Forex & Gold trading 24/5 — fully automated, risk-managed, and profitable.",
  primaryButtonText = "Start Free Trial",
  primaryButtonHref = "/signup",
  secondaryButtonText = "See How It Works",
  secondaryButtonHref = "#how-it-works",
}: ResponsiveHeroBannerProps) {
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        paddingBottom: "5rem",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: "-8rem", left: "50%", transform: "translateX(-50%)", width: "60rem", height: "30rem", borderRadius: "9999px", background: "#dc2626", opacity: 0.07, filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "30%", right: "-10rem", width: "28rem", height: "28rem", borderRadius: "9999px", background: "#ffd700", opacity: 0.04, filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>
            Artemis<span style={{ color: "var(--accent)" }}>Trader</span>
          </span>
        </Link>

        <div className="hidden md:flex" style={{ gap: "2rem", alignItems: "center" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", padding: "0.5rem 1rem", transition: "color 0.2s" }}>
            Log In
          </Link>
          <HoverButtonLink href="/signup" size="sm" variant="primary">
            Get Started
          </HoverButtonLink>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero text ──────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "3rem 1.5rem 2.5rem",
          maxWidth: "56rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Badge */}
        <div className="animate-fade-slide-in-1" style={{ marginBottom: "1.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 600, padding: "0.35rem 1rem", borderRadius: "9999px", letterSpacing: "0.03em" }}>
            <span style={{ width: "0.45rem", height: "0.45rem", borderRadius: "9999px", background: "var(--green)", display: "inline-block", boxShadow: "0 0 6px var(--green)" }} />
            {badgeLabel} &mdash; {badgeText}
          </span>
        </div>

        {/* Title */}
        <div className="animate-fade-slide-in-2">
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.15rem" }}>
            {title}
          </h1>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "1.5rem", background: "linear-gradient(135deg, #dc2626 0%, #f87171 50%, #ffd700 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {titleLine2}
          </h1>
        </div>

        {/* Description */}
        <p className="animate-fade-slide-in-3" style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "38rem", marginBottom: "2rem" }}>
          {description}
        </p>

        {/* CTAs */}
        <div className="animate-fade-slide-in-4" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <HoverButtonLink href={primaryButtonHref} variant="primary" size="lg">
            {primaryButtonText}
            <ChevronRight size={18} />
          </HoverButtonLink>
          <HoverButtonLink href={secondaryButtonHref} size="lg">
            {secondaryButtonText}
          </HoverButtonLink>
        </div>
      </div>

      {/* ── Dashboard preview card ─────────────────────────────── */}
      <div
        className="animate-fade-slide-in-4"
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "62rem", marginLeft: "auto", marginRight: "auto", padding: "0 1.5rem" }}
      >
        <div
          style={{
            borderRadius: "1.25rem",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(180deg, #150909 0%, #090909 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.45), 0 0 60px rgba(220,38,38,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Window chrome */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0.75rem 1.25rem" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <div style={{ width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "#f87171" }} />
              <div style={{ width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "#fbbf24" }} />
              <div style={{ width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "#4ade80" }} />
            </div>
            <div style={{ borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", padding: "0.2rem 0.85rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
              Artemis Dashboard Preview
            </div>
            <div style={{ width: "4rem" }} />
          </div>

          {/* Dashboard content */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "0.75rem", padding: "0.75rem" }}>
            {/* Left panel */}
            <div style={{ borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>Live Overview</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "white", letterSpacing: "-0.02em" }}>$12,480.42</p>
                </div>
                <span style={{ borderRadius: "9999px", background: "rgba(52,211,153,0.15)", color: "#6ee7b7", fontSize: "0.7rem", padding: "0.2rem 0.65rem" }}>+8.2% today</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.65rem" }}>
                {[["Win Rate", "68%"], ["Open Trades", "12"], ["Bot Status", "Active"]].map(([label, value]) => (
                  <div key={label} style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)", padding: "0.6rem 0.7rem" }}>
                    <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.3rem" }}>{label}</p>
                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "white" }}>{value}</p>
                  </div>
                ))}
              </div>
              {/* Mini chart */}
              <div style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)", padding: "0.65rem", height: "5.5rem", display: "flex", alignItems: "flex-end", gap: "0.3rem" }}>
                {[18, 32, 24, 42, 34, 58, 42, 66, 54, 78, 64, 86].map((h, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "2px 2px 0 0", background: "linear-gradient(180deg, rgba(248,113,113,0.9), rgba(220,38,38,0.25))", height: h }} />
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <div style={{ borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", padding: "0.85rem" }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Broker Sync</p>
                <div style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)", padding: "0.6rem 0.75rem", display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "rgba(220,38,38,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fca5a5", fontWeight: 700, flexShrink: 0 }}>XM</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500, color: "white" }}>XM MT5 Connected</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)" }}>Latency 42ms</p>
                  </div>
                </div>
                {["Low Risk Profile", "Auto stop-loss enabled", "Affiliate verified"].map((item) => (
                  <div key={item} style={{ borderRadius: "0.65rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.18)", padding: "0.4rem 0.65rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem" }}>{item}</div>
                ))}
              </div>

              <div style={{ borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", padding: "0.85rem", flex: 1 }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Recent Activity</p>
                {[["EUR/USD", "+$248.10", true], ["XAU/USD", "+$112.42", true], ["GBP/JPY", "-$38.50", false]].map(([pair, pnl, pos]) => (
                  <div key={pair as string} style={{ borderRadius: "0.65rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.18)", padding: "0.4rem 0.65rem", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.8)" }}>{pair}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: pos ? "#6ee7b7" : "#fca5a5" }}>{pnl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
