"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  cs: string; // "rgba(r,g,b,"
  oa: number; // originalAlpha
}

interface Props {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  duration?: number;
  style?: React.CSSProperties;
}

export default function VaporTextIn({
  text,
  fontSize = 32,
  fontFamily = "sans-serif",
  fontWeight = 700,
  color = "rgba(0,0,0,0.88)",
  duration = 900,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min((window.devicePixelRatio || 1) * 1.5, 3);

    const build = (): Particle[] => {
      const ctx = canvas.getContext("2d")!;
      const fontStr = `${fontWeight} ${fontSize * dpr}px ${fontFamily}`;

      // measure
      ctx.font = fontStr;
      const m  = ctx.measureText(text);
      const cw = Math.ceil(m.width) + 8;
      const ch = Math.ceil(fontSize * 1.5);

      canvas.style.width  = `${cw / dpr}px`;
      canvas.style.height = `${ch / dpr}px`;
      canvas.width  = cw;
      canvas.height = ch;

      // render text to sample pixels
      ctx.clearRect(0, 0, cw, ch);
      ctx.font         = fontStr;
      ctx.fillStyle    = color;
      ctx.textAlign    = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, ch / 2);

      const { data } = ctx.getImageData(0, 0, cw, ch);
      const step = Math.max(1, Math.round(dpr));
      const out: Particle[] = [];

      for (let y = 0; y < ch; y += step) {
        for (let x = 0; x < cw; x += step) {
          const i = (y * cw + x) * 4;
          if (data[i + 3] > 0) {
            out.push({
              x, y,
              cs: `rgba(${data[i]},${data[i+1]},${data[i+2]},`,
              oa: (data[i + 3] / 255) * (step / dpr),
            });
          }
        }
      }

      ctx.clearRect(0, 0, cw, ch);
      return out;
    };

    const run = (particles: Particle[]) => {
      let t0: number | null = null;

      const tick = (t: number) => {
        if (t0 === null) t0 = t;
        const p   = Math.min((t - t0) / duration, 1);
        const ctx = canvas.getContext("2d")!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        particles.forEach(({ x, y, cs, oa }) => {
          ctx.fillStyle = cs + p * oa + ")";
          ctx.fillRect(x / dpr, y / dpr, 1, 1);
        });

        ctx.restore();
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const init = () => run(build());

    // wait for font before sampling
    document.fonts?.ready ? document.fonts.ready.then(init) : init();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, fontSize, fontFamily, fontWeight, color, duration]);

  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      {/* hidden for a11y/SEO */}
      <span style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", userSelect: "none", pointerEvents: "none" }}>
        {text}
      </span>
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block" }} />
    </div>
  );
}
