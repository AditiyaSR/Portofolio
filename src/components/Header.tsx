"use client";

import { motion } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import { ThemeToggle } from "./ThemeToggle";
import { TranslateWidget } from "./TranslateWidget";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: motionTokens.duration.normal,
        ease: motionTokens.easing.smooth,
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--theme-bg-base)]/80 backdrop-blur-md border-b border-[var(--theme-border)]"
    >
      <div className="text-[var(--theme-text-primary)] font-display font-medium text-lg tracking-tight">
        ASR<span className="text-[var(--theme-accent)]">.</span>
      </div>
      <nav className="flex items-center gap-4 sm:gap-6">
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--theme-text-secondary)]">
          <li>
            <a href="#experience" className="hover:text-[var(--theme-accent)] transition-colors">
              Experience
            </a>
          </li>
          <li>
            <a href="#education" className="hover:text-[var(--theme-accent)] transition-colors">
              Education
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-[var(--theme-accent)] transition-colors">
              Projects
            </a>
          </li>
          <li>
            <a href="#certificates" className="hover:text-[var(--theme-accent)] transition-colors">
              Certificates
            </a>
          </li>
        </ul>
        
        {/* Utilities: Language & Theme */}
        <div className="flex items-center gap-3 border-l border-[var(--theme-border)] pl-4">
          <TranslateWidget />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
