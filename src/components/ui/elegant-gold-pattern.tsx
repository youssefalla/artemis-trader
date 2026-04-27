"use client";

import type React from "react";
import { useTheme } from "@/lib/theme";

interface GoldGradientBgProps {
  children?: React.ReactNode;
}

const STREAK_MASKS = [
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%)",
];

export function GoldGradientBg({ children }: GoldGradientBgProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const goldFull = dark ? "rgb(212, 175, 55)" : "rgb(184, 148, 31)";
  const goldFade = dark ? "rgba(212, 175, 55, 0)" : "rgba(184, 148, 31, 0)";
  const streakOpacity = dark ? 0.22 : 0.10;
  const dotColor = dark ? "rgba(212,175,55,0.55)" : "rgba(184,148,31,0.35)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: dark ? "#000000" : "#ffffff",
      }}
    >
      {/* Radial corner gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: dark
            ? "radial-gradient(100% 100% at 0% 0%, rgb(28, 22, 6) 0%, rgb(0, 0, 0) 100%)"
            : "radial-gradient(100% 100% at 0% 0%, rgb(255, 251, 228) 0%, rgb(255, 255, 255) 100%)",
          mask: "radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88%, rgba(0,0,0,0) 100%)",
          WebkitMask: "radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88%, rgba(0,0,0,0) 100%)",
        }}
      >
        {/* Gold diagonal streaks */}
        {STREAK_MASKS.map((mask, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: streakOpacity,
              background: `linear-gradient(${goldFull} 0%, ${goldFade} 100%)`,
              mask,
              WebkitMask: mask,
              transform: "skewX(45deg)",
            }}
          />
        ))}
      </div>

      {/* Gold dot grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: dark ? 0.18 : 0.10,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      />

      {/* Soft radial center glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: dark
            ? "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 100%)"
            : "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
