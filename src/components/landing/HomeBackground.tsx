"use client";

import { useTheme } from "@/lib/theme";
import { EtheralShadow } from "@/components/ui/etheral-shadow";

export default function HomeBackground() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: dark ? "#0a0800" : "#faf8f0" }}>
      <EtheralShadow
        color={dark ? "rgba(212,175,55,0.75)" : "rgba(180,140,20,0.45)"}
        animation={{ scale: 80, speed: 70 }}
        noise={{ opacity: 0, scale: 1 }}
        sizing="fill"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
