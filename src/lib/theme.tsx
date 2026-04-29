"use client";

import { createContext, useContext, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  isTransitioning: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  function toggle() {
    setIsTransitioning(true);
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Apply theme after overlay has faded in
    setTimeout(() => {
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("artemis-theme", next);
      document.cookie = `artemis-theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    }, 150);
    // Hide overlay after theme has settled
    setTimeout(() => setIsTransitioning(false), 620);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
