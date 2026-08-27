"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-[var(--theme-bg-card)] border border-[var(--theme-border)] opacity-50" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--theme-bg-card)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] transition-all duration-300 shadow-sm active:scale-95"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-500" />}
    </button>
  );
}
