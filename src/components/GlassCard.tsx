"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode, useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motionTokens } from "@/lib/motionTokens";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  const reduce = useReducedMotion();
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const isLow =
      typeof navigator !== "undefined" && (
        ((navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory <= 2) ||
        ((navigator as any).deviceMemory === undefined && navigator.hardwareConcurrency <= 4)
      );
    setIsLowEnd(Boolean(isLow));
  }, []);

  const duration = isLowEnd ? 0.2 : motionTokens.duration.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.lg }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: reduce ? 0.1 : duration, 
        ease: motionTokens.easing.smooth, 
        delay: reduce ? 0 : delay 
      }}
      whileHover={{ scale: reduce ? 1 : 1.01 }}
      whileTap={{ scale: reduce ? 1 : 0.98 }}
      className={cn("glass-panel", className)}
    >
      {children}
    </motion.div>
  );
}
