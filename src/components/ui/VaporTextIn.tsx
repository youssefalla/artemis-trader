"use client";

import { useRef, useEffect, useState, useMemo } from "react";

type Particle = {
  originalX: number;
  originalY: number;
  color: string;
  originalAlpha: number;
};

function parseRgb(color: string) {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `rgba(${m[1]},${m[2]},${m[3]},` : "rgba(0,0,0,";
}

export default function VaporTextIn({
  text,
  font = { fontFamily: "sans-serif", fontSize: "32px", fontWeight: 700 },
  color = "rgb(26,16,0)",
  alignment = "center",
  duration = 0.9,
}: {
  text: string;
  font?: { fontFamily?: string; fontSize?: string; fontWeight?: number };
  color?: string;
  alignment?: "left" | "center" | "right";
  duration?: number;
}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particles  = useRef<Particle[]>([]);
  const fadeRef    = useRef(0);
  const doneRef    = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const dpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio * 1.5 : 1), []);

  // Observe wrapper size
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setSize({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  // Build particle map whenever size or text changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.width  = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    canvas.width  = Math.floor(size.w * dpr);
    canvas.height = Math.floor(size.h * dpr);

    const fs = parseInt(font.fontSize?.replace("px", "") || "32");
    ctx.font         = `${font.fontWeight ?? 700} ${fs * dpr}px ${font.fontFamily ?? "sans-serif"}`;
    ctx.textBaseline = "middle";
    ctx.textAlign    = alignment;
    ctx.fillStyle    = parseRgb(color) + "1)";

    const tx = alignment === "center" ? canvas.width / 2 : alignment === "left" ? 0 : canvas.width;
    ctx.fillText(text, tx, canvas.height / 2);

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ps: Particle[] = [];
    const sr = Math.max(1, Math.round(dpr / 3));
    const colorPrefix = parseRgb(color);

    for (let y = 0; y < canvas.height; y += sr) {
      for (let x = 0; x < canvas.width; x += sr) {
        const i = (y * canvas.width + x) * 4;
        if (data[i + 3] > 0) {
          ps.push({
            originalX: x,
            originalY: y,
            color: colorPrefix,
            originalAlpha: (data[i + 3] / 255) * (sr / dpr),
          });
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.current = ps;
    fadeRef.current   = 0;
    doneRef.current   = false;
  }, [size, text, color, dpr, font, alignment]);

  // Fade-in animation loop (in only — never vaporizes out)
  useEffect(() => {
    if (!particles.current.length) return;
    let raf: number;
    let last = performance.now();
    doneRef.current = false;

    const tick = (now: number) => {
      if (doneRef.current) return;
      const dt = (now - last) / 1000;
      last = now;

      fadeRef.current = Math.min(1, fadeRef.current + dt / duration);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);
        for (const p of particles.current) {
          const op = fadeRef.current * p.originalAlpha;
          ctx.fillStyle = p.color + op + ")";
          ctx.fillRect(p.originalX / dpr, p.originalY / dpr, 1, 1);
        }
        ctx.restore();
      }

      if (fadeRef.current < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneRef.current = true;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [particles.current.length, duration, dpr]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block", pointerEvents: "none" }} />
    </div>
  );
}
