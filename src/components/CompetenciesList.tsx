"use client";

import type { Skill } from "@/generated/prisma_client";
import { motion } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import Image from "next/image";

type Props = {
  skills: Skill[];
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }, // Faster stagger for tags
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0, 
    transition: { duration: 0.3, ease: motionTokens.easing.smooth } 
  },
};

function getSkillIconUrl(skillName: string): string | null {
  const name = skillName.toLowerCase();
  if (name.includes("solidworks")) {
    return "https://upload.wikimedia.org/wikipedia/commons/b/bf/SOLIDWORKS_Logo.svg";
  }
  if (name.includes("scripting")) {
    return "https://cdn.simpleicons.org/python/eab308";
  }
  if (name.includes("data analysis")) {
    return "https://cdn.simpleicons.org/pandas/white";
  }
  if (name.includes("next.js") || name.includes("nextjs")) {
    return "https://cdn.simpleicons.org/nextdotjs/white";
  }
  if (name.includes("prisma")) {
    return "https://cdn.simpleicons.org/prisma/white";
  }
  if (name.includes("postgres")) {
    return "https://cdn.simpleicons.org/postgresql/white";
  }
  return null;
}

export function CompetenciesList({ skills }: Props) {
  return (
    <motion.ul 
      role="list" 
      className="flex flex-wrap gap-3" 
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {skills.map((skill) => (
        <motion.li
          key={skill.id}
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-default hit-area-min flex items-center justify-center px-5 py-3 rounded-[12px] bg-[var(--theme-bg-card)] border border-[var(--theme-border)] transition-all duration-300 text-sm font-medium hover:bg-[var(--theme-accent)] hover:text-zinc-950 hover:border-[var(--theme-accent)] text-[var(--theme-text-secondary)] shadow-sm hover:shadow-md"
        >
          {skill.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
