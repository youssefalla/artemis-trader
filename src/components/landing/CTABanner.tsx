"use client";

import { useT } from "@/lib/i18n";

export default function CTABanner() {
  const { T } = useT();

  return (
    <section style={{ padding: "0 1.5rem 7rem" }}>
      <div className="cta-banner reveal-scale" style={{ position: "relative", maxWidth: "72rem", margin: "0 auto", borderRadius: "1.5rem", padding: "4rem 2.5rem", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="#D4AF37" strokeWidth=".4" fill="none">
            <path d="M-50,200 C200,140 400,260 700,180 S 1100,140 1250,200" />
            <path d="M-50,260 C200,210 400,310 700,250 S 1100,200 1250,260" />
            <path d="M-50,140 C200,80 400,200 700,120 S 1100,80 1250,140" />
          </g>
        </svg>

        <div style={{ position: "relative", maxWidth: "42rem" }}>
          <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— Last call</div>
          <h2 className="font-display blur-headline no-line" data-blur="section" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", lineHeight: 1, marginTop: "1rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            {T.cta.title}
          </h2>
          <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)", maxWidth: "32rem" }}>
            {T.cta.subtitle}
          </p>
          <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            <a href="/signup" className="btn-gold" style={{ borderRadius: "9999px", padding: "0.875rem 1.75rem", fontSize: "0.875rem" }}>
              {T.cta.btn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
