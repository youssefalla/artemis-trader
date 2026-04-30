"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

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

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.getBoundingClientRect().top + window.scrollY - 88;
  const start = window.scrollY;
  const distance = target - start;
  const duration = 900;
  let startTime: number | null = null;

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function LandingNavbar() {
  const { theme, toggle } = useTheme();
  const { T } = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: [string, string][] = [
    [T.nav.features, "features"],
    [T.nav.howItWorks, "how"],
    [T.nav.pricing, "pricing"],
    [T.nav.voices, "voices"],
  ];

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
          background: theme === "dark" ? "rgba(8,8,12,0.45)" : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: theme === "dark" ? "1px solid rgba(212,175,55,0.12)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: theme === "dark"
            ? "0 2px 24px -8px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(212,175,55,0.06)"
            : "0 2px 24px -8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
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
          {navLinks.map(([label, id]) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                onMouseEnter={(e) => ((e.currentTarget).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget).style.color = "var(--text-secondary)")}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }} className="md:ml-0">
          <LanguageSwitcher />

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
            {T.nav.login}
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
          {navLinks.map(([label, id]) => (
            <button
              key={id}
              onClick={() => { scrollTo(id); setMobileOpen(false); }}
              style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}
            >
              {label}
            </button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <LanguageSwitcher compact />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <Link href="/login" style={{ flex: 1, textAlign: "center", fontSize: "0.875rem", padding: "0.625rem 1rem", border: "1px solid var(--border)", borderRadius: "9999px", color: "var(--text-primary)", textDecoration: "none" }}>
              {T.nav.login}
            </Link>
            <a
              href="#pricing"
              className="btn-gold"
              style={{ flex: 1, borderRadius: "9999px", padding: "0.625rem 1rem", fontSize: "0.875rem", textAlign: "center" }}
              onClick={() => setMobileOpen(false)}
            >
              {T.hero.cta1}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
