"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { motionTokens } from "@/lib/motionTokens";

const mechanicalTools = [
  {
    name: "SolidWorks",
    icon: "/logos/solidworks.svg",
    color: "group-hover:border-[#E32828]/60",
  },
  {
    name: "Fusion 360",
    icon: "/logos/fusion360.svg",
    color: "group-hover:border-[#0696D7]/60",
  },
  {
    name: "Inventor",
    icon: "/logos/inventor.svg",
    color: "group-hover:border-[#FFB81C]/60",
  },
  {
    name: "OriginPro",
    icon: "/logos/originlab.png",
    color: "group-hover:border-[#0284C7]/60",
  },
  {
    name: "Match! XRD",
    icon: "/logos/match.ico",
    color: "group-hover:border-[#059669]/60",
  },
  {
    name: "HighScore",
    icon: "/logos/highscore.png",
    color: "group-hover:border-[#DC2626]/60",
  },
];

const softwareTools = [
  {
    name: "Next.js",
    icon: "/logos/nextjs.svg",
    color: "group-hover:border-[var(--theme-text-primary)]",
    invertInDark: true,
  },
  {
    name: "TypeScript",
    icon: "/logos/typescript.svg",
    color: "group-hover:border-[#3178C6]/60",
  },
  {
    name: "Python",
    icon: "/logos/python.svg",
    color: "group-hover:border-[#3776AB]/60",
  },
  {
    name: "Pandas",
    icon: "/logos/pandas.svg",
    color: "group-hover:border-[#E70488]/60",
    invertInDark: true,
  },
  {
    name: "Prisma",
    icon: "/logos/prisma.svg",
    color: "group-hover:border-[#5A67D8]/60",
    invertInDark: true,
  },
  {
    name: "PostgreSQL",
    icon: "/logos/postgresql.svg",
    color: "group-hover:border-[#336791]/60",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.8, ease: motionTokens.easing.spring } 
  },
};

export function SoftwareStack({ isSoftware }: { isSoftware?: boolean }) {
  const tools = isSoftware ? softwareTools : mechanicalTools;

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {tools.map((tool) => (
        <motion.div 
          key={tool.name} 
          variants={item}
          className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[var(--theme-bg-card)] border border-[var(--theme-border)] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${tool.color}`}
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center">
            <Image 
              src={tool.icon} 
              alt={`${tool.name} official logo`} 
              fill 
              className="object-contain p-1" 
              unoptimized 
            />
          </div>
          <h4 className="font-display font-medium text-sm text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text-primary)] transition-colors duration-300 text-center">
            {tool.name}
          </h4>
        </motion.div>
      ))}
    </motion.div>
  );
}
