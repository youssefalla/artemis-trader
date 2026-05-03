"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function buildParticles(container: HTMLElement) {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 4 + "s";
    s.style.animationDuration = 3 + Math.random() * 3 + "s";
    container.appendChild(s);
  }
}

function buildBars(container: HTMLElement, seed: number) {
  container.innerHTML = "";
  const bars: HTMLElement[] = [];
  for (let i = 0; i < 14; i++) {
    const b = document.createElement("span");
    const h = 2 + Math.floor(Math.abs(Math.sin(seed + i * 0.7)) * 26);
    b.className = "bar-live";
    b.style.cssText = `display:inline-block;width:4px;border-radius:2px;height:${h}px;background:rgba(212,175,55,${0.45 + (h / 32) * 0.55});animation-delay:${i * 0.04}s, ${0.6 + i * 0.18}s;animation-duration:.6s, ${2.4 + (i % 4) * 0.4}s;`;
    container.appendChild(b);
    bars.push(b);
  }
  return bars;
}

function makePath(seed: number) {
  const pts: [number, number][] = [];
  const steps = 16;
  let y = 140;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 600;
    const drift = Math.sin(seed + i * 0.45) * 14;
    const trend = -i * 6.8;
    y = Math.max(10, Math.min(170, 140 + trend + drift));
    pts.push([x, y]);
  }
  let d = `M${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const cx = (x1 + x2) / 2;
    d += ` C${cx},${y1.toFixed(1)} ${cx},${y2.toFixed(1)} ${x2},${y2.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return { line: d, fill: d + ` L${last[0]},180 L0,180 Z`, end: last };
}

function triggerBlurIn(el: HTMLElement) {
  const words = el.querySelectorAll<HTMLElement>(".bw");
  words.forEach((word, i) => {
    const delay = Math.pow(i / Math.max(words.length, 1), 0.8) * 0.3 + i * 0.036;
    word.style.transitionDelay = `${delay.toFixed(3)}s`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("in");
    });
  });
}

export default function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const barsEurRef = useRef<HTMLDivElement>(null);
  const barsBtcRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const kpiPlRef = useRef<HTMLSpanElement>(null);
  const kpiPlPctRef = useRef<HTMLSpanElement>(null);
  const kpiTradesRef = useRef<HTMLSpanElement>(null);
  const kpiWinRef = useRef<HTMLSpanElement>(null);
  const posEurRef = useRef<HTMLSpanElement>(null);
  const posBtcRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function start() {
      if (headlineRef.current) triggerBlurIn(headlineRef.current);
      if (particlesRef.current) buildParticles(particlesRef.current);
    }
    if ((window as any).__artemisReady) { start(); return; }
    window.addEventListener("artemis:ready", start, { once: true });
    return () => window.removeEventListener("artemis:ready", start);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let raf: number | null = null;
    function update() {
      raf = null;
      const y = Math.min(window.scrollY, 800);
      const p = y / 800;
      const rx = 14 - p * 10;
      const ry = -10 + p * 6;
      const tz = -p * 30;
      const ty = -p * 40;
      card!.style.transform = `translateY(${ty}px) translateZ(${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(1deg)`;
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const eurBarsContainer = barsEurRef.current;
    const btcBarsContainer = barsBtcRef.current;
    let eurBars: HTMLElement[] = [];
    let btcBars: HTMLElement[] = [];
    if (eurBarsContainer) eurBars = buildBars(eurBarsContainer, 1.3);
    if (btcBarsContainer) btcBars = buildBars(btcBarsContainer, 5.7);

    function tickBars(bars: HTMLElement[], seedShift: number) {
      bars.forEach((b, i) => {
        const h = 2 + Math.floor(Math.abs(Math.sin(Date.now() / 900 + i * 0.7 + seedShift)) * 26);
        b.style.height = h + "px";
        b.style.background = `rgba(212,175,55,${0.45 + (h / 32) * 0.55})`;
        b.style.transition = "height .9s cubic-bezier(.22,.61,.36,1), background .9s ease";
      });
    }

    let seed = 0.7;
    function updateCurve() {
      seed += 0.18;
      const { line, fill, end } = makePath(seed);
      if (curveRef.current) curveRef.current.setAttribute("d", line);
      if (fillRef.current) fillRef.current.setAttribute("d", fill);
      if (dotRef.current) { dotRef.current.setAttribute("cx", String(end[0])); dotRef.current.setAttribute("cy", end[1].toFixed(1)); }
      if (pulseRef.current) { pulseRef.current.setAttribute("cx", String(end[0])); pulseRef.current.setAttribute("cy", end[1].toFixed(1)); }
    }

    let pl = 1284, pct = 2.41, trades = 7, win = 68;
    let eurPct = 0.42, btcPct = 1.18;

    function flash(el: HTMLElement | null) {
      if (!el) return;
      el.classList.remove("flip");
      void el.offsetWidth;
      el.classList.add("flip");
    }

    function tickNumbers() {
      pl = Math.max(900, pl + (Math.random() - 0.42) * 16);
      pct = Math.max(0.5, Math.min(4.2, pct + (Math.random() - 0.5) * 0.18));
      if (Math.random() < 0.18) trades = Math.max(4, Math.min(11, trades + (Math.random() < 0.5 ? -1 : 1)));
      if (Math.random() < 0.12) win = Math.max(62, Math.min(74, win + (Math.random() < 0.5 ? -1 : 1)));
      eurPct = Math.max(-0.6, Math.min(1.4, eurPct + (Math.random() - 0.5) * 0.16));
      btcPct = Math.max(-0.4, Math.min(2.6, btcPct + (Math.random() - 0.5) * 0.22));

      if (kpiPlRef.current) { kpiPlRef.current.textContent = Math.round(pl).toLocaleString("en-US"); flash(kpiPlRef.current); }
      if (kpiPlPctRef.current) {
        kpiPlPctRef.current.textContent = `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%`;
        kpiPlPctRef.current.className = `kpi-num ${pct >= 0 ? "kpi-up" : "kpi-down"}`;
        flash(kpiPlPctRef.current);
      }
      if (kpiTradesRef.current && Math.random() < 0.4) { kpiTradesRef.current.textContent = String(trades); flash(kpiTradesRef.current); }
      if (kpiWinRef.current && Math.random() < 0.3) { kpiWinRef.current.textContent = String(win); flash(kpiWinRef.current); }
      if (posEurRef.current) {
        posEurRef.current.textContent = (eurPct >= 0 ? "+" : "") + eurPct.toFixed(2) + "%";
        posEurRef.current.className = `kpi-num ${eurPct >= 0 ? "kpi-up" : "kpi-down"}`;
        flash(posEurRef.current);
      }
      if (posBtcRef.current) {
        posBtcRef.current.textContent = (btcPct >= 0 ? "+" : "") + btcPct.toFixed(2) + "%";
        posBtcRef.current.className = `kpi-num ${btcPct >= 0 ? "kpi-up" : "kpi-down"}`;
        flash(posBtcRef.current);
      }
    }

    function tickClock() {
      if (!clockRef.current) return;
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      clockRef.current.textContent = `${hh}:${mm}:${ss} EST`;
    }

    let started = false;
    const intervals: ReturnType<typeof setInterval>[] = [];

    function start() {
      if (started) return;
      started = true;
      tickClock();
      intervals.push(setInterval(tickClock, 1000));
      intervals.push(setInterval(tickNumbers, 2200));
      intervals.push(setInterval(() => { tickBars(eurBars, 0); tickBars(btcBars, 3.2); }, 1600));
      intervals.push(setInterval(updateCurve, 3200));
      setTimeout(() => { tickNumbers(); updateCurve(); }, 2200);
    }

    function stop() {
      started = false;
      intervals.forEach(clearInterval);
      intervals.length = 0;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0.15 }
    );
    io.observe(card);

    return () => { stop(); io.disconnect(); };
  }, []);

  const cell = (opacity: number) => (
    <div
      style={{
        height: "10px", borderRadius: "2px",
        background: `rgba(212,175,55,${opacity})`,
      }}
    />
  );

  return (
    <section ref={sectionRef} className="hero-landing-section" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "8rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", overflow: "hidden" }}>
      {/* Parallax background image */}
      <motion.div
        style={{
          y: bgY,
          position: "absolute",
          inset: "-15% 0",
          backgroundImage: "url('/ChatGPT Image May 3, 2026, 05_43_37 AM.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          willChange: "transform",
        }}
      />
      {/* Background */}
      <div className="hero-bg">
        <div className="hero-img-overlay" />
        <div className="particles" ref={particlesRef} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0 }} viewBox="0 0 1200 800" preserveAspectRatio="none" className="dark:opacity-35">
          <g stroke="#D4AF37" strokeWidth=".4" fill="none" opacity=".7">
            <path d="M0,600 C200,520 400,640 700,540 S 1100,500 1200,560" />
            <path d="M0,300 C300,240 500,360 800,260 S 1100,220 1200,280" />
            <path d="M0,720 C150,700 350,760 600,700 S 1000,720 1200,690" />
          </g>
        </svg>
      </div>

      <div style={{ position: "relative", maxWidth: "72rem", margin: "0 auto", width: "100%", display: "grid", gap: "3rem", alignItems: "center" }} className="lg:grid-cols-2">
        {/* Left: text */}
        <div className="reveal-left">
          <div className="font-mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", border: "1px solid rgba(10,10,10,0.1)", borderRadius: "9999px", padding: "0.375rem 0.75rem" }}>
            <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#D4AF37", flexShrink: 0 }} />
            Algorithmic · Always On
          </div>

          <h1
            ref={headlineRef}
            className="font-display blur-headline no-line"
            style={{ marginTop: "1.5rem", fontSize: "clamp(2.75rem, 6.2vw, 5.25rem)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 800 }}
          >
            <span className="bw">Make</span>{" "}
            <span className="bw">Money</span>
            <br />
            <span className="bw">While</span>{" "}
            <span className="bw">You</span>
            <br />
            <span style={{ display: "inline-block" }}>
              <em className="bw gold-shimmer not-italic">Sleep.</em>
              <span className="sleep-line" />
            </span>
          </h1>

          <p style={{ marginTop: "1.5rem", maxWidth: "38rem", fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Artemis-Trader is the quiet automation engine for self-directed traders.
            Risk-managed strategies, broker-grade execution, and the peace of mind to log off.
          </p>

          <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            <a href="#pricing" className="btn-gold" style={{ borderRadius: "9999px", padding: "0.875rem 1.5rem", fontSize: "0.875rem" }}>
              Start 7-Day Trial
            </a>
            <a href="#how" className="btn-outline" style={{ borderRadius: "9999px", padding: "0.875rem 1.5rem", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", border: "1px solid currentColor", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg>
              </span>
              View Demo
            </a>
          </div>

          <div className="font-mono" style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.65rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
            <span>NO CARD REQUIRED</span>
            <span style={{ width: "0.25rem", height: "0.25rem", borderRadius: "9999px", background: "currentColor", opacity: 0.4 }} />
            <span>CANCEL ANYTIME</span>
            <span style={{ width: "0.25rem", height: "0.25rem", borderRadius: "9999px", background: "currentColor", opacity: 0.4 }} />
            <span>SOC-2 IN PROGRESS</span>
          </div>
        </div>

        {/* Right: 3D dashboard */}
        <div className="scene-3d reveal-right floaty">
          <div ref={cardRef} className="dash-card dash-shimmer" style={{ borderRadius: "1rem", padding: "1.25rem", width: "100%" }}>
            {/* Top bar */}
            <div className="dash-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span style={{ width: "0.625rem", height: "0.625rem", borderRadius: "9999px", background: "rgba(255,95,87,0.8)" }} />
                <span style={{ width: "0.625rem", height: "0.625rem", borderRadius: "9999px", background: "rgba(254,188,46,0.8)" }} />
                <span style={{ width: "0.625rem", height: "0.625rem", borderRadius: "9999px", background: "rgba(40,200,64,0.8)" }} />
              </div>
              <span className="font-mono" style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", fontSize: "0.65rem" }}>
                <span className="live-dot" />
                artemis · live
              </span>
              <span ref={clockRef} className="font-mono" style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>14:32:00 EST</span>
            </div>

            {/* KPIs */}
            <div className="dash-row" style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {[
                {
                  label: "Today P/L", prefix: "+ $", mainRef: kpiPlRef, main: "1,284",
                  subRef: kpiPlPctRef, sub: "▲ 2.41%", subClass: "kpi-num kpi-up", suffix: <span style={{ fontSize: "0.75rem", color: "#D4AF37" }}>.40</span>
                },
                {
                  label: "Open trades", mainRef: kpiTradesRef, main: "7",
                  subRef: null, sub: "3 long · 4 short", subClass: ""
                },
                {
                  label: "Win rate · 30d", mainRef: kpiWinRef, main: "68",
                  subRef: null, sub: "142/209", subClass: "", suffix: <span style={{ fontSize: "0.75rem", color: "#D4AF37" }}>%</span>
                },
              ].map(({ label, prefix, mainRef, main, subRef, sub, subClass, suffix }) => (
                <div key={label} style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.55)", padding: "0.75rem", background: "rgba(255,255,255,0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                  <div className="font-mono" style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>{label}</div>
                  <div className="font-display" style={{ fontSize: "1.5rem" }}>
                    {prefix}<span ref={mainRef} className="kpi-num">{main}</span>{suffix}
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.65rem", marginTop: "0.25rem" }}>
                    {subRef
                      ? <span ref={subRef} className={subClass}>{sub}</span>
                      : <span style={{ color: "var(--text-secondary)" }}>{sub}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Equity chart */}
            <div className="dash-row" style={{ marginTop: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.55)", padding: "0.75rem", background: "rgba(255,255,255,0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>Equity Curve</span>
                  <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>30D</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {["1D", "30D", "YTD"].map((tf) => (
                    <span key={tf} className={`font-mono ${tf === "30D" ? "tf-active" : ""}`} style={{ fontSize: "0.6rem", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", border: tf === "30D" ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(0,0,0,0.05)", background: tf === "30D" ? "rgba(212,175,55,0.15)" : "transparent", color: tf === "30D" ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {tf}
                    </span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 600 180" style={{ width: "100%", height: "9rem" }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity=".45" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="currentColor" strokeOpacity=".08" strokeWidth="1">
                  <line x1="0" y1="40" x2="600" y2="40" />
                  <line x1="0" y1="90" x2="600" y2="90" />
                  <line x1="0" y1="140" x2="600" y2="140" />
                </g>
                <path ref={fillRef} className="eq-fill" d="M0,140 C40,130 70,138 100,120 C140,100 170,110 210,90 C250,70 280,82 320,60 C360,40 400,55 430,45 C470,30 510,40 540,28 C570,18 590,22 600,18 L600,180 L0,180 Z" fill="url(#g1)" />
                <path ref={curveRef} className="eq-curve" d="M0,140 C40,130 70,138 100,120 C140,100 170,110 210,90 C250,70 280,82 320,60 C360,40 400,55 430,45 C470,30 510,40 540,28 C570,18 590,22 600,18" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                <circle ref={pulseRef} className="eq-pulse" cx="600" cy="18" r="4" fill="#D4AF37" fillOpacity=".25" />
                <circle ref={dotRef} className="eq-dot" cx="600" cy="18" r="4" fill="#D4AF37" />
              </svg>
            </div>

            {/* Positions */}
            <div className="dash-row" style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { pair: "EUR/USD", barsRef: barsEurRef, pctRef: posEurRef, initPct: "+0.42%" },
                { pair: "XAU/USD", barsRef: barsBtcRef, pctRef: posBtcRef, initPct: "+1.18%" },
              ].map(({ pair, barsRef, pctRef, initPct }) => (
                <div key={pair} style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.55)", padding: "0.75rem", background: "rgba(255,255,255,0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span className="font-mono">{pair}</span>
                    <span ref={pctRef} className="kpi-num kpi-up font-mono">{initPct}</span>
                  </div>
                  <div ref={barsRef} style={{ marginTop: "0.5rem", display: "flex", alignItems: "flex-end", gap: "2px", height: "2rem" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
