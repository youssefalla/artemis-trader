"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(hide);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ls-fadein {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ls-fadeout {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
        @keyframes ls-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.18); }
        }
        @keyframes ls-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .ls-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: var(--bg-primary, #f8f6f0);
          animation: ls-fadeout 0.45s ease 1.2s forwards;
        }
        .dark .ls-overlay { background: #090600; }
        .ls-logo {
          animation: ls-fadein 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.05s both;
        }
        .ls-text {
          animation: ls-fadein 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .ls-dot {
          display: inline-block;
          animation: ls-pulse 1.1s ease-in-out 0.4s infinite;
        }
        .ls-sub {
          animation: ls-fadein 0.5s ease 0.35s both;
        }
        .ls-bar-track {
          animation: ls-fadein 0.4s ease 0.45s both;
        }
        .ls-bar-fill {
          animation: ls-bar 0.85s cubic-bezier(0.4,0,0.2,1) 0.5s both;
        }
      `}</style>

      <div className="ls-overlay">
        {/* Logo */}
        <div className="ls-logo" style={{ marginBottom: "1.25rem" }}>
          <img
            src="/logo.png"
            alt="Artemis"
            width={56}
            height={56}
            style={{ objectFit: "contain", filter: "drop-shadow(0 0 18px rgba(212,175,55,0.45))" }}
          />
        </div>

        {/* Name */}
        <div className="ls-text" style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
          <span
            className="font-display"
            style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            Artemis
          </span>
          <span className="ls-dot" style={{ color: "#D4AF37", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1, margin: "0 0.05rem" }}>·</span>
          <span
            className="font-display"
            style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            Trader
          </span>
        </div>

        {/* Tagline */}
        <p
          className="ls-sub font-mono"
          style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#D4AF37", marginTop: "0.5rem", opacity: 0.85 }}
        >
          Trading Automation
        </p>

        {/* Progress bar */}
        <div
          className="ls-bar-track"
          style={{ marginTop: "2rem", width: "7rem", height: "2px", borderRadius: "9999px", background: "rgba(212,175,55,0.18)", overflow: "hidden" }}
        >
          <div
            className="ls-bar-fill"
            style={{ height: "100%", borderRadius: "9999px", background: "linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37)", width: 0 }}
          />
        </div>
      </div>
    </>
  );
}
