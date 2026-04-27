import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { HoverButtonLink } from "@/components/ui/hover-button";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "4rem",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "28rem",
          height: "28rem",
          borderRadius: "9999px",
          background: "#dc2626",
          opacity: 0.1,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          background: "#7f1d1d",
          opacity: 0.12,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            border: "1px solid var(--accent)",
            background: "var(--accent-glow)",
            color: "var(--accent)",
            fontSize: "0.875rem",
            fontWeight: 500,
            marginBottom: "2rem",
          }}
        >
          <Zap size={14} />
          Powered by MT5 — XM Broker Integration
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          Trading Automation
          <br />
          <span className="gradient-text">&amp; Peace of Mind</span>
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            maxWidth: "42rem",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          Connect your XM MT5 account, set your risk level, and let Artemis handle
          Forex &amp; Gold trading 24/5 — fully automated, fully transparent.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <HoverButtonLink href="/signup" variant="primary" size="lg">
            Start Trading Now
            <ArrowRight size={18} />
          </HoverButtonLink>
          <HoverButtonLink href="#how-it-works" size="lg">
            See How It Works
          </HoverButtonLink>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            maxWidth: "28rem",
            margin: "0 auto",
          }}
        >
          {[
            { icon: Shield, value: "100%", label: "Non-custodial" },
            { icon: Zap, value: "24/5", label: "Always Active" },
            { icon: BarChart3, value: "$25", label: "per month" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
              <Icon size={20} style={{ color: "var(--accent)", marginBottom: "0.25rem" }} />
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
