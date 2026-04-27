"use client";

import Link from "next/link";

const ArtemisLogo = () => (
  <img src="/logo.png" alt="Artemis" width={28} height={28} style={{ objectFit: "contain" }} />
);

export default function Footer() {
  return (
    <footer className="reveal" style={{ padding: "5rem 1.5rem 2.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2.5rem" }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
              <ArtemisLogo />
              <span className="font-display" style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
                Artemis<span style={{ color: "#D4AF37" }}>·</span>Trader
              </span>
            </Link>
            <p style={{ marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "22rem", lineHeight: 1.7 }}>
              Trading automation &amp; peace of mind. Built for self-directed traders who want their nights back.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {[
                { label: "X", icon: <path d="M18 3h3l-7.5 8.6L22 21h-6.5l-5-6.4L4.8 21H1.7l8-9.2L1 3h6.7l4.5 5.9L18 3z" /> },
                { label: "LinkedIn", icon: <><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7c.6-1 2-1.9 4-1.9 4.3 0 5.2 2.8 5.2 6.5V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" /></> },
                { label: "GitHub", icon: <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /> },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{ width: "2.25rem", height: "2.25rem", display: "grid", placeItems: "center", borderRadius: "9999px", border: "1px solid var(--border)", textDecoration: "none", color: "var(--text-secondary)", transition: "border-color 0.2s, color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">{icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <div className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", opacity: 0.6 }}>Product</div>
            <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["Features", "Pricing", "Strategies", "Brokers"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ fontSize: "0.875rem", color: "var(--text-primary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#D4AF37")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", opacity: 0.6 }}>Company</div>
            <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["About", "Careers", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ fontSize: "0.875rem", color: "var(--text-primary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#D4AF37")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="font-mono" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", opacity: 0.6 }}>Resources</div>
            <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["Documentation", "Backtesting Lab", "Risk Calculator", "Community"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ fontSize: "0.875rem", color: "var(--text-primary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#D4AF37")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-rule" style={{ marginTop: "3.5rem" }} />

        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          <div>
            <div className="font-mono" style={{ textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6, marginBottom: "0.5rem" }}>Legal Disclaimer</div>
            <p style={{ lineHeight: 1.7 }}>
              Trading carries substantial risk and may result in the loss of all invested capital. Past performance is not indicative of future results. Artemis-Trader is a software tool — not a broker, dealer, or registered investment adviser. Information on this site is for educational purposes only and does not constitute investment, legal, or tax advice.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="font-mono" style={{ textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6, marginBottom: "0.5rem" }}>Compliance</div>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {["Terms of Service", "Privacy Policy", "Risk Disclosure", "Cookie Settings"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#D4AF37")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="font-mono" style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", fontSize: "0.7rem", color: "var(--text-secondary)", opacity: 0.6 }}>
          <span>© 2026 Artemis-Trader, Inc. All rights reserved.</span>
          <span>Crafted in low light · Designed to disappear.</span>
        </div>
      </div>
    </footer>
  );
}
