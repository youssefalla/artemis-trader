"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STYLES = `
  @keyframes ls-fadein {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ls-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.18); }
  }
  @keyframes ls-bar {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes ls-fadeout {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  .ls-overlay {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: var(--bg-primary, #f8f6f0);
  }
  .dark .ls-overlay { background: #090600; }
  .ls-overlay.ls-out { animation: ls-fadeout 0.35s ease forwards; }
  .ls-logo  { animation: ls-fadein 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.05s both; }
  .ls-text  { animation: ls-fadein 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.18s both; }
  .ls-dot   { display:inline-block; animation: ls-pulse 1.1s ease-in-out 0.4s infinite; }
  .ls-sub   { animation: ls-fadein 0.4s ease 0.3s both; }
  .ls-track { animation: ls-fadein 0.4s ease 0.38s both; }
  .ls-fill  { animation: ls-bar 0.9s cubic-bezier(0.4,0,0.2,1) 0.42s both; }
`;

function Overlay({ exiting }: { exiting: boolean }) {
  return (
    <>
      <style>{STYLES}</style>
      <div className={`ls-overlay${exiting ? " ls-out" : ""}`}>
        <div className="ls-logo" style={{ marginBottom: "1.25rem" }}>
          <img
            src="/logo.png"
            alt="Artemis"
            width={56}
            height={56}
            style={{ objectFit: "contain", filter: "drop-shadow(0 0 18px rgba(212,175,55,0.45))" }}
          />
        </div>

        <div className="ls-text" style={{ display: "flex", alignItems: "center" }}>
          <span className="font-display" style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Artemis
          </span>
          <span className="ls-dot" style={{ color: "#D4AF37", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1, margin: "0 0.05rem" }}>·</span>
          <span className="font-display" style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary, #1a1200)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Trader
          </span>
        </div>

        <p className="ls-sub font-mono" style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#D4AF37", marginTop: "0.5rem", opacity: 0.85 }}>
          Trading Automation
        </p>

        <div className="ls-track" style={{ marginTop: "2rem", width: "7rem", height: "2px", borderRadius: "9999px", background: "rgba(212,175,55,0.18)", overflow: "hidden" }}>
          <div className="ls-fill" style={{ height: "100%", borderRadius: "9999px", background: "linear-gradient(90deg,#D4AF37,#f0d060,#D4AF37)", width: 0 }} />
        </div>
      </div>
    </>
  );
}

export default function LoadingScreen() {
  const pathname  = usePathname();
  const prevPath  = useRef(pathname);

  // "idle" | "showing" | "exiting"
  const [state, setState] = useState<"idle" | "showing" | "exiting">("showing");

  // ── Initial splash: auto-exit after 1.2 s ──
  useEffect(() => {
    const exit = setTimeout(() => setState("exiting"), 1200);
    const hide = setTimeout(() => setState("idle"),    1600);
    return () => { clearTimeout(exit); clearTimeout(hide); };
  }, []);

  // ── Navigation: show on link click, hide when pathname settles ──
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return;
      if (href === pathname) return;
      setState("showing");
    }
    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, [pathname]);

  // ── Dismiss when the new route is active ──
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const exit = setTimeout(() => setState("exiting"), 200);
    const hide = setTimeout(() => setState("idle"),    580);
    return () => { clearTimeout(exit); clearTimeout(hide); };
  }, [pathname]);

  if (state === "idle") return null;
  return <Overlay exiting={state === "exiting"} />;
}
