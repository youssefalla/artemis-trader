"use client";

import { useT } from "@/lib/i18n";
import BlurWords from "@/components/ui/BlurWords";

export default function HowItWorks() {
  const { T } = useT();

  const steps = [
    { num: "01", title: T.how.step1Title, desc: T.how.step1Desc, time: T.how.step1Time },
    { num: "02", title: T.how.step2Title, desc: T.how.step2Desc, time: T.how.step2Time },
    { num: "03", title: T.how.step3Title, desc: T.how.step3Desc, time: T.how.step3Time },
  ];

  return (
    <section id="how" style={{ position: "relative" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "7rem 1.5rem" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: "36rem", margin: "0 auto 5rem" }}>
          <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— {T.how.label}</div>
          <h2 className="font-display blur-headline" data-blur="section" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", marginTop: "0.75rem", lineHeight: 1 }}>
            <BlurWords text={T.how.title} />
          </h2>
          <p style={{ marginTop: "1.25rem", color: "var(--text-secondary)" }}>{T.how.subtitle}</p>
        </div>

        <ol style={{ position: "relative", listStyle: "none", padding: 0, margin: 0 }} className="stagger">
          <span style={{ position: "absolute", left: "1.6875rem", top: "0.5rem", bottom: "0.5rem", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)" }} />

          {steps.map(({ num, title, desc, time }, i) => (
            <li key={num} className="reveal" style={{ position: "relative", paddingLeft: "5rem", paddingBottom: i < steps.length - 1 ? "3.5rem" : 0 }}>
              <div className="step-dot font-display" style={{ position: "absolute", left: 0, top: 0, width: "3.5rem", height: "3.5rem", borderRadius: "9999px", display: "grid", placeItems: "center", fontSize: "1.5rem", color: "#D4AF37" }}>
                {num}
              </div>
              <h3 className="font-display" style={{ fontSize: "1.875rem", lineHeight: 1.1 }}>{title}</h3>
              <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)", maxWidth: "36rem", lineHeight: 1.7 }}>{desc}</p>
              <div className="font-mono" style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#22C55E" }} />
                {time}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
