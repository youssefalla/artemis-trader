"use client";

import React, { useRef, useEffect, useState } from 'react';
import { HoverButton } from "@/components/ui/hover-button";
import { useTheme } from "@/lib/theme";

// ── Internal ────────────────────────────────────────────────────────────────

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = ({ contained = false }: { contained?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? [0, 0, 0] : [0.97, 0.97, 0.97];

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const loc = glBgColorLocationRef.current;
    if (gl && program && loc) {
      gl.useProgram(program);
      gl.uniform3fv(loc, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        uv.x *= 1.5; uv.x -= 0.25;
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        /* Red/gold palette instead of default */
        vec3 foregroundColor=vec3(0.86+v.x*0.1, 0.14+v.y*0.1, 0.15+v.x*0.2);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask);
        color=mix(color,vec3(1.0,0.84,0.0),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array([0, 0, 0]));

    let animId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = contained ? canvas.offsetWidth : window.innerWidth;
      canvas.height = contained ? canvas.offsetHeight : window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: contained ? 'absolute' : 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
};

// ── Exports ─────────────────────────────────────────────────────────────────

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export const PricingCard = ({
  planName, description, price, priceSuffix = '/mo', features, buttonText, isPopular = false, buttonVariant = 'primary'
}: PricingCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isPopular
    ? isDark
      ? 'linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(10,3,3,0.92) 100%)'
      : 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(255,255,255,0.95) 100%)'
    : isDark
      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.85) 100%)';

  const cardBorder = isPopular
    ? '1px solid rgba(220,38,38,0.45)'
    : isDark
      ? '1px solid rgba(255,255,255,0.09)'
      : '1px solid rgba(0,0,0,0.08)';

  const cardShadow = isPopular
    ? isDark
      ? '0 0 40px rgba(220,38,38,0.22), 0 8px 32px rgba(0,0,0,0.5)'
      : '0 0 32px rgba(220,38,38,0.15), 0 8px 24px rgba(0,0,0,0.12)'
    : isDark
      ? '0 4px 24px rgba(0,0,0,0.4)'
      : '0 4px 24px rgba(0,0,0,0.08)';

  const textPrimary = isDark ? '#f5f5f5' : '#111111';
  const textSecondary = isDark ? '#9a8484' : '#666666';
  const textFeature = isDark ? '#d4d4d4' : '#333333';

  const dividerBg = isPopular
    ? 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4) 50%, transparent)'
    : isDark
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)'
      : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 50%, transparent)';


  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        maxWidth: '22rem',
        padding: '2rem 1.75rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: cardBg,
        border: cardBorder,
        boxShadow: cardShadow,
        transform: isPopular ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent)',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.3rem 1rem',
          borderRadius: '9999px',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          MOST POPULAR
        </div>
      )}

      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: textPrimary,
          lineHeight: 1.1,
        }}>{planName}</h2>
        <p style={{ fontSize: '0.9rem', color: textSecondary, marginTop: '0.25rem' }}>{description}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '1.25rem 0' }}>
        <span style={{
          fontSize: '3rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: textPrimary,
          lineHeight: 1,
        }}>${price}</span>
        <span style={{ fontSize: '0.8rem', color: textSecondary }}>{priceSuffix}</span>
      </div>

      <div style={{ width: '100%', height: '1px', marginBottom: '1.25rem', background: dividerBg }} />

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flex: 1 }}>
        {features.map((feature, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: textFeature }}>
            <CheckIcon className={isPopular ? "text-[var(--accent)]" : "text-[var(--green)]"} />
            {feature}
          </li>
        ))}
      </ul>

      <HoverButton
        variant={buttonVariant === 'primary' ? 'primary' : 'default'}
        className="mt-auto w-full"
      >
        {buttonText}
      </HoverButton>
    </div>
  );
};

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}: ModernPricingPageProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const overlayBg = isDark
    ? 'linear-gradient(to bottom, rgba(8,8,8,0.82) 0%, rgba(8,8,8,0.70) 50%, rgba(8,8,8,0.82) 100%)'
    : 'linear-gradient(to bottom, rgba(247,247,247,0.82) 0%, rgba(247,247,247,0.70) 50%, rgba(247,247,247,0.82) 100%)';

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        overflow: 'hidden',
        background: 'var(--background)',
      }}
    >
      {showAnimatedBackground && <ShaderCanvas contained />}

      {showAnimatedBackground && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: overlayBg,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #dc2626 0%, #f87171 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}>
            {title}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#9a8484', maxWidth: '36rem', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </div>
    </section>
  );
};
