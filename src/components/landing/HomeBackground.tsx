"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme";

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform float u_dark;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2  uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.18;

    /* domain warping: fbm(fbm(fbm(uv))) — creates organic silk/wave flow */
    vec2  q = vec2(fbm(uv + t),           fbm(uv + 1.0));
    vec2  r = vec2(fbm(uv + q + vec2(1.7, 9.2) + 0.15 * t),
                   fbm(uv + q + vec2(8.3, 2.8) + 0.13 * t));
    float f = fbm(uv + r);
    float v = clamp(f * f * 3.5, 0.0, 1.0);

    vec3 bg = u_dark > 0.5
      ? vec3(0.040, 0.031, 0.000)
      : vec3(0.980, 0.973, 0.941);
    vec3 fg = u_dark > 0.5
      ? vec3(0.83, 0.687, 0.21) * 0.50
      : vec3(0.70, 0.548, 0.078) * 0.28;

    gl_FragColor = vec4(mix(bg, fg, v * v), 1.0);
  }
`;

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_res");
    const uDark = gl.getUniformLocation(prog, "u_dark");

    gl.uniform1f(uDark, theme === "dark" ? 1.0 : 0.0);

    let raf: number;
    const t0 = performance.now();

    function resize() {
      canvas!.width  = Math.ceil(window.innerWidth  / 2);
      canvas!.height = Math.ceil(window.innerHeight / 2);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      gl!.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
