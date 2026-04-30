"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "@/lib/i18n";
import { LANGUAGES, Lang } from "@/lib/translations";
import { useTheme } from "@/lib/theme";

export default function LanguageSwitcher({ compact = false, dropUp = false }: { compact?: boolean; dropUp?: boolean }) {
  const { lang, setLang } = useT();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "0.35rem",
          padding: compact ? "0.3rem 0.6rem" : "0.45rem 0.75rem",
          borderRadius: "9999px",
          background: "transparent",
          border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: "0.8125rem", fontWeight: 500,
          transition: "border-color 0.2s, color 0.2s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <span style={{ fontSize: "1rem" }}>{current.flag}</span>
        {!compact && <span>{current.label}</span>}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          ...(dropUp ? { bottom: "calc(100% + 0.5rem)" } : { top: "calc(100% + 0.5rem)" }),
          right: 0,
          minWidth: "9rem",
          background: dark ? "rgba(16,16,21,0.95)" : "rgba(255,255,255,0.97)",
          border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.10)",
          borderRadius: "0.875rem",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden",
          zIndex: 99999,
        }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as Lang); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                width: "100%", padding: "0.6rem 0.875rem",
                background: l.code === lang ? (dark ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.10)") : "transparent",
                border: "none", cursor: "pointer",
                color: l.code === lang ? "#D4AF37" : "var(--text-primary)",
                fontSize: "0.875rem", fontWeight: l.code === lang ? 600 : 400,
                textAlign: "left", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (l.code !== lang) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
              onMouseLeave={(e) => { if (l.code !== lang) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "1.1rem" }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
