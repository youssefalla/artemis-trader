'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

interface AnimationConfig { scale: number; speed: number; }
interface NoiseConfig    { opacity: number; scale: number; }

interface ShadowOverlayProps {
  sizing?:    'fill' | 'stretch';
  color?:     string;
  animation?: AnimationConfig;
  noise?:     NoiseConfig;
  style?:     CSSProperties;
  className?: string;
  children?:  React.ReactNode;
}

function mapRange(v: number, fl: number, fh: number, tl: number, th: number) {
  if (fl === fh) return tl;
  return tl + ((v - fl) / (fh - fl)) * (th - tl);
}

export function EtheralShadow({
  sizing    = 'fill',
  color     = 'rgba(212,175,55,0.85)',
  animation,
  noise,
  style,
  className,
  children,
}: ShadowOverlayProps) {
  const rawId   = useId();
  const id      = `shadowoverlay-${rawId.replace(/:/g, '')}`;
  const enabled = !!(animation && animation.scale > 0);

  const feColorMatrixRef    = useRef<SVGFEColorMatrixElement>(null);
  const hueMotion           = useMotionValue(180);
  const hueAnim             = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale   = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration   = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (!feColorMatrixRef.current || !enabled) return;
    hueAnim.current?.stop();
    hueMotion.set(0);
    hueAnim.current = animate(hueMotion, 360, {
      duration:    animationDuration / 25,
      repeat:      Infinity,
      repeatType:  'loop',
      ease:        'linear',
      onUpdate: (v) => feColorMatrixRef.current?.setAttribute('values', String(v)),
    });
    return () => hueAnim.current?.stop();
  }, [enabled, animationDuration, hueMotion]);

  return (
    <div className={className} style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%', ...style }}>
      <div style={{ position: 'absolute', inset: -displacementScale, filter: enabled ? `url(#${id}) blur(4px)` : 'none' }}>
        {enabled && (
          <svg style={{ position: 'absolute' }}>
            <defs>
              <filter id={id}>
                <feTurbulence result="undulation" numOctaves="2"
                  baseFrequency={`${mapRange(animation!.scale,0,100,0.001,0.0005)},${mapRange(animation!.scale,0,100,0.004,0.002)}`}
                  seed="0" type="turbulence" />
                <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
                <feColorMatrix in="dist" result="circulation" type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
                <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
                <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
              </filter>
            </defs>
          </svg>
        )}
        <div style={{
          backgroundColor: color,
          maskImage:    `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
          maskSize:     sizing === 'stretch' ? '100% 100%' : 'cover',
          maskRepeat:   'no-repeat',
          maskPosition: 'center',
          width: '100%', height: '100%',
        }} />
      </div>

      {children}

      {noise && noise.opacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
          backgroundSize:   noise.scale * 200,
          backgroundRepeat: 'repeat',
          opacity:          noise.opacity / 2,
          pointerEvents:    'none',
        }} />
      )}
    </div>
  );
}
