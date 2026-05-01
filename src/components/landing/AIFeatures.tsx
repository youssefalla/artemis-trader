"use client";

import { useT } from "@/lib/i18n";
import BlurWords from "@/components/ui/BlurWords";

export default function AIFeatures() {
  const { T } = useT();

  return (
    <section id="ai" style={{ position: "relative", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="reveal-left">
            <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— {T.aiFeatures.label}</div>
            <h2 className="font-display blur-headline" data-blur="section" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", letterSpacing: "-0.03em", marginTop: "0.75rem", lineHeight: 1 }}>
              <BlurWords text={T.aiFeatures.title} />
            </h2>
          </div>
          <p className="reveal-right" style={{ maxWidth: "26rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {T.aiFeatures.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gap: "1.25rem" }} className="stagger">
          {/* Top wide: Signal Tracking */}
          <div className="ai-card reveal" style={{ minHeight: "360px" }}>
            <div className="ai-scan" />
            <div className="ai-content" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", padding: "2rem 2.5rem", alignItems: "center" }}>
              <div style={{ display: "grid", gap: "2rem", alignItems: "center" }} className="md:grid-cols-2">
                <div>
                  <h3 className="font-display" style={{ color: "var(--text-primary)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.05 }}>
                    {T.aiFeatures.card1Title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", marginTop: "1.5rem", maxWidth: "22rem", lineHeight: 1.7 }}>
                    {T.aiFeatures.card1Desc}
                  </p>
                  <div className="font-mono" style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37" }}>
                    <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#D4AF37", animation: "digit-pulse 1.6s ease-in-out infinite" }} />
                    Live · 247 signals/min
                  </div>
                </div>

                {/* Mock UI */}
                <div className="ai-mock floaty" style={{ padding: "1.25rem" }}>
                  <div className="font-mono" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.6875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                      <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#D4AF37" }} />
                      <span>My signals</span>
                      <span style={{ color: "var(--text-secondary)", opacity: 0.4 }}>/</span>
                      <span style={{ color: "var(--text-secondary)", opacity: 0.6 }}>Artemis Lab 2026</span>
                    </div>
                    <div style={{ width: "3rem", height: "1.25rem", borderRadius: "9999px", background: "rgba(10,10,10,0.06)", border: "1px solid rgba(10,10,10,0.08)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "0.125rem" }}>
                      <span style={{ width: "1rem", height: "1rem", borderRadius: "9999px", background: "#D4AF37" }} />
                    </div>
                  </div>
                  <div style={{ color: "var(--text-primary)", fontSize: "0.875rem", marginTop: "1rem" }}>Momentum strategy</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem" }}>
                    {[["Entry", "2/3"], ["Exit", "1/3"]].map(([label, w]) => (
                      <div key={label} className="ai-mock-input" style={{ padding: "0.75rem" }}>
                        <div className="font-mono" style={{ fontSize: "0.625rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                        <div style={{ marginTop: "0.5rem", height: "0.375rem", borderRadius: "9999px", background: "rgba(10,10,10,0.07)" }}>
                          <div style={{ height: "100%", width: w === "2/3" ? "66%" : "33%", borderRadius: "9999px", background: "linear-gradient(90deg, #B8941F, #D4AF37)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ai-mock-input" style={{ padding: "0.75rem", marginTop: "0.75rem" }}>
                    <div className="font-mono" style={{ fontSize: "0.625rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Confidence</div>
                    <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ flex: 1, height: "0.375rem", borderRadius: "9999px", background: "rgba(10,10,10,0.07)", overflow: "hidden" }}>
                        <div className="ai-progress-fill" />
                      </div>
                      <span className="ai-cursor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom three cards */}
          <div style={{ display: "grid", gap: "1.25rem" }} className="md:grid-cols-3">
            {/* Trade Monitoring */}
            <div className="ai-card reveal" style={{ minHeight: "380px" }}>
              <div className="ai-content" style={{ height: "100%", padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, display: "grid", placeItems: "center", position: "relative" }}>
                  <div style={{ position: "absolute", top: "0.5rem", left: "50%", transform: "translateX(-50%)", width: "2.25rem", height: "2.25rem", borderRadius: "9999px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", display: "grid", placeItems: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><circle cx="12" cy="8" r="3.5" /><path d="M5 21c1-4 4-6 7-6s6 2 7 6" /></svg>
                  </div>
                  <span style={{ position: "absolute", top: "2.75rem", bottom: "2.75rem", left: "50%", transform: "translateX(-50%)", width: "1px", background: "linear-gradient(to bottom, rgba(212,175,55,0.4), rgba(212,175,55,0.15), rgba(212,175,55,0.4))" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 1 }}>
                    {["8", "5", "0", "$"].map((k) => (
                      <span key={k} className="ai-key">{k}</span>
                    ))}
                  </div>
                  <div style={{ position: "absolute", bottom: "0.5rem", left: "50%", transform: "translateX(-50%)", width: "2.25rem", height: "2.25rem", borderRadius: "9999px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", display: "grid", placeItems: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 6V4M17 6V4M3 11h18" /></svg>
                  </div>
                </div>
                <h3 className="font-display" style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginTop: "1rem" }}>{T.aiFeatures.card2Title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.7 }}>
                  {T.aiFeatures.card2Desc}
                </p>
              </div>
            </div>

            {/* Strategy Performance */}
            <div className="ai-card reveal" style={{ minHeight: "380px" }}>
              <div className="ai-content" style={{ height: "100%", padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
                  <div className="floaty" style={{ position: "relative", width: "130px", height: "130px" }}>
                    <svg viewBox="0 0 140 140" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="9" />
                      <circle cx="70" cy="70" r="54" fill="none" stroke="#D4AF37" strokeWidth="9"
                        strokeLinecap="round" className="perf-ring" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span className="font-display" style={{ fontSize: "2rem", lineHeight: 1, color: "var(--text-primary)" }}>68<span style={{ fontSize: "1rem", color: "#D4AF37" }}>%</span></span>
                      <span className="font-mono" style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37", marginTop: "0.3rem" }}>Win Rate</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    {[["Sharpe", "2.4"], ["Max DD", "−8%"], ["Trades", "142"]].map(([label, val]) => (
                      <div key={label} className="perf-stat" style={{ textAlign: "center" }}>
                        <div className="font-display" style={{ fontSize: "1.1rem", lineHeight: 1, color: "var(--text-primary)" }}>{val}</div>
                        <div className="font-mono" style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginTop: "0.3rem" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="font-display" style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginTop: "1rem" }}>{T.aiFeatures.card3Title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.7 }}>
                  {T.aiFeatures.card3Desc}
                </p>
              </div>
            </div>

            {/* Secure Capital Protection */}
            <div className="ai-card glow-right reveal" style={{ minHeight: "380px" }}>
              <div className="ai-content" style={{ height: "100%", padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
                  <div style={{ position: "relative", width: "240px", height: "200px" }}>
                    <div style={{ position: "absolute", left: "50%", top: "-0.25rem", transform: "translateX(-50%)", width: "2.75rem", height: "2.75rem", borderRadius: "9999px", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.35)", display: "grid", placeItems: "center", color: "#D4AF37", zIndex: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2v20M16 6H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H8" /></svg>
                    </div>
                    <div style={{ position: "absolute", left: "50%", bottom: "0.75rem", transform: "translateX(-50%)", width: "2.75rem", height: "2.75rem", borderRadius: "9999px", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.35)", display: "grid", placeItems: "center", color: "#D4AF37", zIndex: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
                    </div>
                    <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "0.5rem", height: "0.5rem", borderRadius: "9999px", background: "#D4AF37", boxShadow: "0 0 12px #D4AF37" }} />
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 240 200" fill="none">
                      <defs>
                        <linearGradient id="arcG" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                          <stop offset="50%" stopColor="#D4AF37" stopOpacity=".6" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M30 100 A 90 90 0 0 0 210 100" stroke="url(#arcG)" strokeWidth="1" />
                      <path d="M50 100 A 70 70 0 0 0 190 100" stroke="url(#arcG)" strokeWidth="1" opacity=".7" />
                      <path d="M70 100 A 50 50 0 0 0 170 100" stroke="url(#arcG)" strokeWidth="1" opacity=".5" />
                      <circle r="3" fill="#D4AF37">
                        <animateMotion dur="6s" repeatCount="indefinite" path="M30 100 A 90 90 0 0 0 210 100" />
                      </circle>
                      <circle r="2.5" fill="#E6C75A" opacity=".8">
                        <animateMotion dur="5s" repeatCount="indefinite" path="M50 100 A 70 70 0 0 0 190 100" />
                      </circle>
                    </svg>
                  </div>
                </div>
                <h3 className="font-display" style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginTop: "1rem" }}>{T.aiFeatures.card4Title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.7, maxWidth: "28rem" }}>
                  {T.aiFeatures.card4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
