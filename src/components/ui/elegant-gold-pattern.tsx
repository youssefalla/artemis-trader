"use client";

import type React from "react";
import { useTheme } from "@/lib/theme";

interface GoldGradientBgProps {
  children?: React.ReactNode;
}

export function GoldGradientBg({ children }: GoldGradientBgProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

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
          opacity: dark ? 0.3 : 1,
          background: dark
            ? "radial-gradient(100% 100% at 0% 0%, rgb(28, 22, 6) 0%, rgb(0, 0, 0) 100%)"
            : "radial-gradient(100% 100% at 0% 0%, rgb(255, 251, 228) 0%, rgb(255, 255, 255) 100%)",
          mask: "radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88%, rgba(0,0,0,0) 100%)",
          WebkitMask: "radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88%, rgba(0,0,0,0) 100%)",
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
