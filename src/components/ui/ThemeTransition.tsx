"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export default function ThemeTransition() {
  const { isTransitioning } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setExiting(false);
      setMounted(true);
    } else if (mounted) {
      setExiting(true);
      const t = setTimeout(() => setMounted(false), 380);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes tt-logo {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes tt-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        .tt-overlay {
          position: fixed; inset: 0; z-index: 9998;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: var(--bg-primary, #f8f6f0);
          transition: opacity 0.28s ease;
        }
        .dark .tt-overlay { background: #090600; }
        .tt-logo  { animation: tt-logo 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
        .tt-text  { animation: tt-logo 0.22s cubic-bezier(0.34,1.56,0.64,1) 0.06s both; }
        .tt-dot   { display:inline-block; animation: tt-pulse 1.1s ease-in-out infinite; }
        .tt-sub   { animation: tt-logo 0.22s ease 0.1s both; }
      `}</style>

      <div
        className="tt-overlay"
        style={{ opacity: exiting ? 0 : 1, pointerEvents: "none" }}
      >
        <div className="tt-logo" style={{ marginBottom: "1rem" }}>
          <img
            src="/logo.png"
            alt="Artemis"
            width={48}
            height={48}
            style={{ objectFit: "contain", filter: "drop-shadow(0 0 14px rgba(212,175,55,0.4))" }}
          />
        </div>

        <div className="tt-text" style={{ display: "flex", alignItems: "center" }}>
          <span
            className="font-display"
            style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            Artemis
          </span>
          <span
            className="tt-dot"
            style={{ color: "#D4AF37", fontSize: "1.45rem", fontWeight: 700, lineHeight: 1, margin: "0 0.05rem" }}
          >·</span>
          <span
            className="font-display"
            style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            Trader
          </span>
        </div>

        <p
          className="tt-sub font-mono"
          style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#D4AF37", marginTop: "0.45rem", opacity: 0.8 }}
        >
          {typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "Dark Mode" : "Light Mode"}
        </p>
      </div>
    </>
  );
}
