"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";

export default function Features() {
  const { T } = useT();
  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = heatmapRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let t = 0;
    let raf: number;

    function animate() {
      t += 0.008;
      const cells = container!.children as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < cells.length; i++) {
        const opacity = 0.08 + ((Math.sin(i * 0.7 + 1.3 + t) + 1) / 2) * 0.72;
        cells[i].style.background = `rgba(212,175,55,${opacity.toFixed(3)})`;
      }
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);


  return (
    <section id="features" style={{ position: "relative", maxWidth: "72rem", margin: "0 auto", padding: "7rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="reveal-left">
          <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— {T.features.label}</div>
          <h2 className="font-display blur-headline" data-blur="section" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", letterSpacing: "-0.03em", marginTop: "0.75rem", lineHeight: 1 }}>
            {T.features.title1}
            <br />
            {T.features.title2}
          </h2>
        </div>
        <p className="reveal-right" style={{ maxWidth: "26rem", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1rem" }}>
          {T.features.subtitle}
        </p>
      </div>

      <div style={{ display: "grid", gap: "1.25rem" }} className="stagger">
        {/* 24/7 Automation */}
        <div className="bento reveal" style={{ borderRadius: "1rem", padding: "1.75rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "0.6875rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>01</div>
          <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.1)", display: "grid", placeItems: "center", color: "#D4AF37" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
          </div>
          <h3 className="font-display" style={{ fontSize: "1.875rem", marginTop: "1.5rem" }}>{T.features.feat1Title}</h3>
          <p style={{ marginTop: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "38rem" }}>
            {T.features.feat1Desc}
          </p>
          <div ref={heatmapRef} style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: "3px" }}>
            {Array.from({ length: 168 }).map((_, i) => (
              <div key={i} style={{ height: "10px", borderRadius: "2px", background: `rgba(212,175,55,${(0.08 + ((Math.sin(i * 0.7 + 1.3) + 1) / 2) * 0.72).toFixed(3)})`, transition: "background 0.6s ease" }} />
            ))}
          </div>
          <div className="font-mono" style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>
            <span>Mon 00:00</span>
            <span style={{ flex: 1, height: "1px", background: "currentColor", opacity: 0.15 }} />
            <span>Sun 24:00</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {/* Risk Management */}
          <div className="bento reveal" style={{ borderRadius: "1rem", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.1)", display: "grid", placeItems: "center", color: "#D4AF37" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" /><path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>02</span>
            </div>
            <h3 className="font-display" style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>{T.features.feat2Title}</h3>
            <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              {T.features.feat2Desc}
            </p>
            <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>DRAWDOWN</span>
              <div style={{ flex: 1, height: "0.375rem", borderRadius: "9999px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "22%", background: "#D4AF37", borderRadius: "9999px" }} />
              </div>
              <span className="font-mono" style={{ fontSize: "0.75rem" }}>2.2%</span>
            </div>
          </div>

          {/* Broker Sync */}
          <div className="bento reveal" style={{ borderRadius: "1rem", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.1)", display: "grid", placeItems: "center", color: "#D4AF37" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7h-3a4 4 0 0 0 0 8h3M15 7h3a4 4 0 0 1 0 8h-3M8 11h8" />
                </svg>
              </div>
              <span className="font-mono" style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)" }}>03</span>
            </div>
            <h3 className="font-display" style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>{T.features.feat3Title}</h3>
            <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              {T.features.feat3Desc}
            </p>
            <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["XM Broker", "OANDA", "Alpaca", "TradeStation"].map((b) => (
                <span key={b} className="font-mono" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.625rem", borderRadius: "9999px", border: "1px solid rgba(0,0,0,0.1)" }}>{b}</span>
              ))}
              <span className="font-mono" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.625rem", borderRadius: "9999px", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>+27 more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
