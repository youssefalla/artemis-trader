"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import { HoverButtonLink } from "@/components/ui/hover-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="section-container"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "4rem",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={18} style={{ color: "white" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>
              Artemis<span style={{ color: "var(--accent)" }}>Trader</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
            {["#features", "#pricing", "#how-it-works"].map((href, i) => (
              <a
                key={href}
                href={href}
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none" }}
              >
                {["Features", "Pricing", "How It Works"][i]}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/login"
              style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", padding: "0.5rem 1rem" }}
            >
              Log In
            </Link>
            <HoverButtonLink href="/signup" size="sm" variant="primary">
              Get Started
            </HoverButtonLink>
            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.25rem" }}
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {["#features", "#pricing", "#how-it-works"].map((href, i) => (
            <a
              key={href}
              href={href}
              style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none" }}
              onClick={() => setOpen(false)}
            >
              {["Features", "Pricing", "How It Works"][i]}
            </a>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <HoverButtonLink href="/login" size="sm" className="flex-1">
              Log In
            </HoverButtonLink>
            <HoverButtonLink href="/signup" size="sm" variant="primary" className="flex-1">
              Get Started
            </HoverButtonLink>
          </div>
        </div>
      )}
    </nav>
  );
}
