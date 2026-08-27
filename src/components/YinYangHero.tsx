"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function YinYangHero({ name }: { name: string }) {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  const getWidth = (side: "left" | "right") => {
    if (!hoveredSide) return "50%";
    if (hoveredSide === side) return "70%";
    return "30%";
  };

  return (
    <div className="flex flex-col md:flex-row h-[80vh] w-full overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl mb-32">
      {/* LEFT SIDE - YIN (Mechanical) */}
      <Link href="/?mode=mechanical" className="block relative h-full w-full md:w-auto" style={{ textDecoration: 'none' }}>
        <motion.div
          className="relative h-full w-full bg-zinc-950 flex flex-col justify-center items-center cursor-pointer group"
          animate={{ width: typeof window !== "undefined" && window.innerWidth >= 768 ? getWidth("left") : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-4 whitespace-nowrap">
              Mechanical
              <span className="block text-yellow-500">Engineer</span>
            </h2>
            <p className="text-zinc-400 max-w-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
              Specializing in Internal Combustion Optimization, Material Science, and SolidWorks Automation.
            </p>
            <motion.div 
              className="mt-8 opacity-0 group-hover:opacity-100 flex items-center gap-2 text-yellow-500 font-medium"
              initial={{ y: 20 }}
              animate={{ y: hoveredSide === "left" ? 0 : 20 }}
            >
              Explore Hardware <ArrowRight size={20} />
            </motion.div>
          </div>
        </motion.div>
      </Link>

      {/* RIGHT SIDE - YANG (Web Developer) */}
      <Link href="/?mode=software" className="block relative h-full w-full md:w-auto" style={{ textDecoration: 'none' }}>
        <motion.div
          className="relative h-full w-full bg-zinc-100 flex flex-col justify-center items-center cursor-pointer group"
          animate={{ width: typeof window !== "undefined" && window.innerWidth >= 768 ? getWidth("right") : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            <h2 className="font-display text-4xl md:text-6xl font-medium text-zinc-900 mb-4 whitespace-nowrap">
              Software
              <span className="block text-blue-600">Developer</span>
            </h2>
            <p className="text-zinc-600 max-w-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
              Building high-performance SaaS, automated agents, and SOTA web architectures using Next.js & AI.
            </p>
            <motion.div 
              className="mt-8 opacity-0 group-hover:opacity-100 flex items-center gap-2 text-blue-600 font-medium"
              initial={{ y: 20 }}
              animate={{ y: hoveredSide === "right" ? 0 : 20 }}
            >
              Explore Software <ArrowRight size={20} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
