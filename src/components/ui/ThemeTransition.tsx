"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";

export default function ThemeTransition() {
  const { isTransitioning, theme } = useTheme();
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Color of the overlay = destination theme's background
  // (light→dark: fade through dark, dark→light: fade through light)
  const overlayColor = theme === "dark" ? "#090600" : "#f8f6f0";

  useEffect(() => {
    if (isTransitioning) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setVisible(true);
      // Tiny rAF delay so the browser paints the element before fading in
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
    } else {
      setOpacity(0);
      hideTimer.current = setTimeout(() => setVisible(false), 480);
    }
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [isTransitioning]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: overlayColor,
        opacity,
        pointerEvents: "none",
        transition: opacity === 1
          ? "opacity 0.18s ease"          // fast fade-in
          : "opacity 0.42s ease",         // slower fade-out
      }}
    />
  );
}
