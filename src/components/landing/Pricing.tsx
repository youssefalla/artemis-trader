"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function runCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let raf: number;
  const ribbons: { x: number; y: number; vx: number; vy: number; len: number; hue: number; alpha: number }[] = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 18; i++) {
    ribbons.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      len: 60 + Math.random() * 80,
      hue: 42 + Math.random() * 16,
      alpha: 0.2 + Math.random() * 0.4,
    });
  }

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    ribbons.forEach((r) => {
      r.x += r.vx;
      r.y += r.vy;
      if (r.x < -r.len) r.x = canvas.width + r.len;
      if (r.x > canvas.width + r.len) r.x = -r.len;
      if (r.y < -r.len) r.y = canvas.height + r.len;
      if (r.y > canvas.height + r.len) r.y = -r.len;
      const grad = ctx!.createLinearGradient(r.x - r.len, r.y, r.x + r.len, r.y);
      grad.addColorStop(0, `hsla(${r.hue},70%,55%,0)`);
      grad.addColorStop(0.5, `hsla(${r.hue},70%,55%,${r.alpha})`);
      grad.addColorStop(1, `hsla(${r.hue},70%,55%,0)`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(r.x - r.len, r.y);
      ctx!.lineTo(r.x + r.len, r.y);
      ctx!.stroke();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

const plans = [
  {
    tier: "Trial",
    price: "$0",
    sub: "7 days · full access",
    features: ["One connected broker", "3 active strategies", "Email support", "No credit card required"],
    cta: "Begin Trial",
    href: "/signup",
    featured: false,
    badge: null,
    ctaClass: "btn-outline",
  },
  {
    tier: "Trader",
    price: "$25",
    priceSuffix: "/mo",
    sub: "Billed monthly · cancel anytime",
    features: ["3 connected brokers", "Unlimited strategies", "Risk Management Suite", "Backtesting · 10 years", "Priority chat support"],
    cta: "Start as Trader",
    href: "/signup",
    featured: true,
    badge: "★ Most Popular",
    ctaClass: "btn-gold",
  },
  {
    tier: "Elite",
    price: "$210",
    priceSuffix: "/yr",
    sub: "Equiv. $17.50/mo · billed annually",
    features: ["Everything in Trader", "Unlimited brokers", "Custom indicators API", "Dedicated success manager", "Quarterly strategy review"],
    cta: "Go Elite",
    href: "/signup",
    featured: false,
    badge: "Save 30%",
    ctaClass: "btn-outline",
  },
];

export default function Pricing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return runCanvas(canvasRef.current);
  }, []);

  return (
    <section id="pricing" className="pricing-stage" style={{ padding: "7rem 1.5rem" }}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div style={{ position: "relative", maxWidth: "72rem", margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: "36rem", margin: "0 auto" }}>
          <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37" }}>— Pricing</div>
          <h2 className="font-display blur-headline" data-blur="section" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", marginTop: "0.75rem", lineHeight: 1 }}>
            <span className="bw">Priced</span>{" "}
            <span className="bw">Like</span>{" "}
            <span className="bw">A</span>{" "}
            <span className="bw">Tool.</span>
            <br />
            <span className="bw">Earns</span>{" "}
            <span className="bw">Like</span>{" "}
            <span className="bw">An</span>{" "}
            <span className="bw">Asset.</span>
          </h2>
          <p style={{ marginTop: "1.25rem", color: "var(--text-secondary)" }}>
            Start free. Upgrade when the engine has paid for itself — usually inside week one.
          </p>
        </div>

        <div style={{ marginTop: "4rem", display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", alignItems: "stretch" }} className="stagger">
          {plans.map(({ tier, price, priceSuffix, sub, features, cta, href, featured, badge, ctaClass }) => (
            <div key={tier} className={`price-card${featured ? " featured" : ""} reveal${featured ? "-scale" : ""}`} style={{ borderRadius: "1rem", padding: "1.75rem", display: "flex", flexDirection: "column", position: "relative" }}>
              {featured && badge && (
                <div className="btn-gold font-mono" style={{ position: "absolute", top: "-0.75rem", left: "50%", transform: "translateX(-50%)", fontSize: "0.6875rem", letterSpacing: "0.18em", textTransform: "uppercase", borderRadius: "9999px", padding: "0.25rem 0.75rem", whiteSpace: "nowrap" }}>
                  {badge}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="font-mono" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: featured ? "#D4AF37" : "var(--text-secondary)" }}>{tier}</div>
                {!featured && badge && (
                  <span className="font-mono" style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.125rem 0.5rem", borderRadius: "9999px", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>{badge}</span>
                )}
              </div>
              <div className="font-display" style={{ fontSize: "3rem", letterSpacing: "-0.04em", marginTop: "0.75rem" }}>
                {price}
                {priceSuffix && <span style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>{priceSuffix}</span>}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{sub}</div>
              <ul style={{ marginTop: "1.5rem", flex: 1, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <span style={{ color: "#D4AF37", marginTop: "0.1rem", flexShrink: 0 }}>●</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={href} className={ctaClass} style={{ marginTop: "2rem", borderRadius: "9999px", padding: "0.75rem 1.25rem", fontSize: "0.875rem", textAlign: "center" }}>
                {cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="font-mono reveal" style={{ marginTop: "2.5rem", textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          All plans include 256-bit encryption · Read-only execution scopes · 99.9% uptime SLA
        </div>
      </div>
    </section>
  );
}
