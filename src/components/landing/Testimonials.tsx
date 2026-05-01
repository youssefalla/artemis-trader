"use client";

import { useT } from "@/lib/i18n";
import BlurWords from "@/components/ui/BlurWords";

const Stars = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}>
    {[1,2,3,4,5].map((i) => <span key={i} style={{ color: "#D4AF37" }}>★</span>)}
  </div>
);

const col1 = [
  {
    stars: true,
    quote: "“My P&L stopped depending on my mood. That alone was worth it.”",
    display: true,
    name: "Marcus Holloway",
    role: "FX swing · 4 years",
    initials: "M",
    bg: "linear-gradient(135deg, #E6C75A, #B8941F)",
    color: "#0A0A0A",
  },
  {
    stars: true,
    quote: "The risk caps are non-negotiable. I appreciate that — discipline I can’t override at 2 a.m. is the discipline I actually need.",
    display: false,
    name: "Dana Yeoh",
    role: "Equities · prop firm",
    initials: "D",
    bg: "#0A0A0A",
    color: "#F5F4EE",
  },
];

const col2 = [
  {
    stars: true,
    quote: "“I sized down expectations and sized up consistency. Eight months in, my volatility-adjusted returns beat anything I did manually.”",
    display: true,
    large: true,
    name: "Amelie Trager",
    role: "Quant · Zurich",
    initials: "A",
    bg: "linear-gradient(135deg, #0A0A0A, #2A2A30)",
    color: "#D4AF37",
    featured: true,
  },
  {
    stars: true,
    quote: "Setup took six minutes. The first week paid for the year. I’m not a power user — that’s the point.",
    display: false,
    name: "Rohit Banerjee",
    role: "Crypto · part-time",
    initials: "R",
    bg: "linear-gradient(135deg, #F5F4EE, #FFFFFF)",
    color: "#0A0A0A",
    border: "1px solid rgba(0,0,0,0.1)",
  },
];

const col3 = [
  {
    stars: true,
    quote: "The dashboards are gorgeous and the broker reconciliation is to-the-cent. Two things most automation tools fail at.",
    display: false,
    name: "Sofía Ruiz",
    role: "Indices · Madrid",
    initials: "S",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.6))",
    color: "#0A0A0A",
  },
  {
    stars: true,
    quote: "“Quiet, dependable, slightly luxurious. Feels like my Patek for portfolios.”",
    display: true,
    name: "Julian Voss",
    role: "Macro · Berlin",
    initials: "J",
    bg: "#0A0A0A",
    color: "#F5F4EE",
  },
];

function Card({ t }: { t: typeof col1[0] & { large?: boolean; featured?: boolean; border?: string } }) {
  return (
    <article
      className="bento"
      style={{
        borderRadius: "1rem",
        padding: t.large ? "1.75rem" : "1.5rem",
        border: t.featured ? "1px solid rgba(212,175,55,0.5)" : t.border,
        boxShadow: t.featured ? "0 0 0 1px rgba(212,175,55,0.2) inset" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stars />
        {t.featured && <span className="font-mono" style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#D4AF37" }}>Featured</span>}
      </div>
      <p
        className={t.display ? "font-display" : ""}
        style={{ fontSize: t.large ? "1.75rem" : t.display ? "1.375rem" : "0.9rem", lineHeight: t.large ? 1.2 : 1.5, marginTop: "1.25rem", color: t.display ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        {t.quote}
      </p>
      <div style={{ marginTop: t.large ? "1.75rem" : "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: t.large ? "2.75rem" : "2.5rem", height: t.large ? "2.75rem" : "2.5rem", borderRadius: "9999px", background: t.bg, display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 700, color: t.color, border: t.border, flexShrink: 0 }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{t.name}</div>
          <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.role}</div>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { T } = useT();
  return (
    <section id="voices" style={{ maxWidth: "72rem", margin: "0 auto", padding: "7rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3.5rem" }}>
        <div className="reveal-left">
          <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— {T.testimonials.label}</div>
          <h2 className="font-display blur-headline" data-blur="section" style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", letterSpacing: "-0.03em", marginTop: "0.75rem", lineHeight: 1 }}>
            <BlurWords text={T.testimonials.title} />
          </h2>
        </div>
        <div className="reveal-right" style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
          <Stars />
          <span className="font-mono" style={{ color: "var(--text-secondary)" }}>4.9 · 2,418 reviews</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }} className="stagger">
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {col1.map((t, i) => <Card key={i} t={t} />)}
        </div>
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {col2.map((t, i) => <Card key={i} t={t as never} />)}
        </div>
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {col3.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}
