"use client";

export default function CTABanner() {
  return (
    <section style={{ padding: "0 1.5rem 7rem" }}>
      <div className="cta-banner reveal-scale" style={{ position: "relative", maxWidth: "72rem", margin: "0 auto", borderRadius: "1.5rem", padding: "4rem 2.5rem", overflow: "hidden" }}>
        {/* Ambient streaks */}
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
            <span className="bw">The</span>{" "}
            <span className="bw">Market</span>{" "}
            <span className="bw">Doesn&apos;t</span>{" "}
            <span className="bw">Sleep.</span>
            <br />
            <span style={{ display: "inline-block" }}>
              <span className="bw gold-shimmer">Now</span>{" "}
              <span className="bw gold-shimmer">You</span>{" "}
              <span className="bw gold-shimmer">Can.</span>
              <span className="sleep-line" />
            </span>
          </h2>
          <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)", maxWidth: "32rem" }}>
            Seven days, full access, zero card. The slowest part of getting started is reading this banner.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            <a
              href="/signup"
              className="btn-gold"
              style={{ borderRadius: "9999px", padding: "0.875rem 1.75rem", fontSize: "0.875rem" }}
            >
              Start 7-Day Trial
            </a>
            <a
              href="/login"
              style={{ borderRadius: "9999px", padding: "0.875rem 1.75rem", fontSize: "0.875rem", fontWeight: 500, border: "1px solid var(--border)", color: "var(--text-secondary)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s", display: "inline-flex", alignItems: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#B8941F"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Talk to a human
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
