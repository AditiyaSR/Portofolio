"use client";

import type { Project } from "@/generated/prisma_client";
import { GlassCard } from "@/components/GlassCard";
import { motion, AnimatePresence } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink, Code2 } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
  projects: Project[];
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: motionTokens.easing.smooth } 
  },
};

export function ProjectsGrid({ projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe escape key listener with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };

    if (selectedProject) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <>
      <motion.div 
        className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {projects.map((proj, i) => (
          <motion.div key={proj.id} variants={item} className={i === 0 ? "md:col-span-2" : "md:col-span-1"}>
            <button 
              onClick={() => setSelectedProject(proj)}
              className="text-left w-full h-full cursor-pointer focus:outline-none"
              aria-label={`View details for ${proj.title}`}
            >
              <GlassCard className="p-8 min-h-[320px] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 group border-[var(--theme-border)] hover:border-[var(--theme-accent)]">
                <article className="mb-auto">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-[var(--theme-border)] group-hover:border-[var(--theme-accent)] group-hover:text-[var(--theme-accent)] transition-colors text-[var(--theme-text-secondary)] bg-[var(--theme-bg-base)]">
                      {proj.category}
                    </span>
                    <span className="tabular-nums text-[var(--theme-text-muted)] text-sm group-hover:text-[var(--theme-accent)] transition-colors">
                      {proj.year}
                    </span>
                  </div>
                  <h3 className="font-display text-balance text-2xl mb-4 text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-pretty text-[var(--theme-text-secondary)] text-sm leading-relaxed group-hover:text-[var(--theme-text-primary)] transition-colors line-clamp-3">
                    {proj.description}
                  </p>
                </article>
                <div className="mt-8 flex justify-end">
                   <span className="text-sm font-medium text-[var(--theme-accent)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                     View Details <ExternalLink size={14} />
                   </span>
                </div>
              </GlassCard>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Global Viewport Portal Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />
              
              {/* Modal Content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Media Section */}
                <div className="relative w-full aspect-video bg-black/40 flex items-center justify-center overflow-hidden border-b border-[var(--theme-border)]">
                  {selectedProject.imageUrl ? (
                    <Image 
                      src={selectedProject.imageUrl} 
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      quality={90}
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--theme-text-muted)] gap-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border)]">
                        <ExternalLink size={24} className="text-[var(--theme-accent)]" />
                      </div>
                      <p className="text-sm">Engineering Project Showcase</p>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex gap-2 items-center mb-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                          {selectedProject.category}
                        </span>
                        {selectedProject.year && (
                          <span className="text-xs text-[var(--theme-text-muted)] font-medium bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                            {selectedProject.year}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[var(--theme-text-primary)]">
                        {selectedProject.title}
                      </h2>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {selectedProject.repositoryUrl && (
                        <a 
                          href={selectedProject.repositoryUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-base)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] transition-all text-sm font-semibold"
                        >
                          <Code2 size={16} /> Source Code
                        </a>
                      )}
                      {selectedProject.demoUrl && (
                        <a 
                          href={selectedProject.demoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-xl shadow-[var(--theme-accent-glow)]"
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-3">Project Scope &amp; Implementation</h4>
                    <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
