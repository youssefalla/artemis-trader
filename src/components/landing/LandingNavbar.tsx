"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

const ArtemisLogo = () => (
  <img src="/logo.png" alt="Artemis" width={28} height={28} style={{ objectFit: "contain" }} />
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function LandingNavbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, padding: "0.75rem 1rem" }}>
      <nav
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          borderRadius: "9999px",
          paddingLeft: "1.25rem",
          paddingRight: "0.5rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          position: "relative",
          background: theme === "dark" ? "rgba(10,10,14,0.90)" : "rgba(248,248,246,0.92)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: theme === "dark" ? "1px solid rgba(212,175,55,0.20)" : "1px solid rgba(255,255,255,0.80)",
          boxShadow: theme === "dark"
            ? "0 4px 20px -6px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 4px 20px -6px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06), inset 2px 2px 1px rgba(255,255,255,0.90), inset -1px -1px 1px rgba(255,255,255,0.60)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
          <ArtemisLogo />
          <span className="font-display" style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
            Artemis<span style={{ color: "#D4AF37" }}>·</span>Trader
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem", listStyle: "none", margin: 0, padding: 0, marginLeft: "auto" }}>
          {[["Features", "#features"], ["How it works", "#how"], ["Pricing", "#pricing"], ["Voices", "#voices"]].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }} className="md:ml-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              width: "2.5rem", height: "2.5rem", borderRadius: "9999px",
              display: "grid", placeItems: "center",
              border: "1px solid rgba(10,10,10,0.1)",
              background: "transparent", cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4AF37")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(10,10,10,0.1)")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            href="/login"
            className="btn-gold"
            style={{ borderRadius: "9999px", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
          >
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.25rem", marginLeft: "auto" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {mobileOpen
              ? <><path d="M18 6L6 18M6 6l12 12" /></>
              : <><path d="M4 6h16M4 12h16M4 18h16" /></>}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="glass md:hidden"
          style={{
            maxWidth: "72rem", margin: "0.5rem auto 0",
            borderRadius: "1.25rem", padding: "1rem 1.5rem",
            display: "flex", flexDirection: "column", gap: "1rem",
          }}
        >
          {[["Features", "#features"], ["How it works", "#how"], ["Pricing", "#pricing"], ["Voices", "#voices"]].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <Link href="/login" style={{ flex: 1, textAlign: "center", fontSize: "0.875rem", padding: "0.625rem 1rem", border: "1px solid var(--border)", borderRadius: "9999px", color: "var(--text-primary)", textDecoration: "none" }}>
              Log In
            </Link>
            <a
              href="#pricing"
              className="btn-gold"
              style={{ flex: 1, borderRadius: "9999px", padding: "0.625rem 1rem", fontSize: "0.875rem", textAlign: "center" }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
