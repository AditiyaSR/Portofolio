"use client";

import type { Achievement } from "@/generated/prisma_client";
import { motion, AnimatePresence } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import { ExternalLink, Trophy, X, Calendar, Award } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  achievements: Achievement[];
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: motionTokens.easing.smooth } 
  },
};

export function AchievementList({ achievements }: Props) {
  const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe escape key listener with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedAch(null);
    };

    if (selectedAch) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedAch]);

  if (achievements.length === 0) return null;
  
  return (
    <>
      <motion.ul 
        role="list" 
        className="space-y-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {achievements.map((ach) => (
          <motion.li 
            key={ach.id} 
            variants={item} 
            onClick={() => setSelectedAch(ach)}
            className="group flex flex-col p-5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/50 hover:bg-[var(--theme-bg-card)] hover:border-[var(--theme-accent)]/60 transition-all duration-300 relative cursor-pointer hover:shadow-lg hover:shadow-[var(--theme-accent-glow)]"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[var(--theme-accent)] group-hover:h-3/4 transition-all duration-500 rounded-r-full opacity-0 group-hover:opacity-100" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                {ach.imageUrl ? (
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-[var(--theme-border)] bg-[var(--theme-bg-base)] shrink-0 group-hover:scale-105 transition-transform">
                    <Image 
                      src={ach.imageUrl} 
                      alt={ach.title} 
                      fill 
                      className="object-contain p-1" 
                      unoptimized 
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy size={18} />
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-bold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors duration-300 flex items-center gap-2">
                    {ach.title}
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--theme-accent)]" />
                  </h3>
                </div>
              </div>
              
              {ach.year && (
                <span className="tabular-nums text-xs font-bold text-[var(--theme-text-muted)] bg-[var(--theme-bg-base)] px-3 py-1 rounded-full shrink-0 border border-[var(--theme-border)] group-hover:border-[var(--theme-accent)]/40 transition-colors">
                  {ach.year}
                </span>
              )}
            </div>
            {ach.description && (
              <p className="mt-2 text-pretty text-sm text-[var(--theme-text-secondary)] leading-relaxed group-hover:text-[var(--theme-text-primary)] transition-colors duration-300 pl-1 line-clamp-2">
                {ach.description}
              </p>
            )}
          </motion.li>
        ))}
      </motion.ul>

      {/* Global Viewport Portal Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedAch && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAch(null)}
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
                  onClick={() => setSelectedAch(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Media Section: Large Banner Preview */}
                <div className="relative w-full aspect-video sm:max-h-[360px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-[var(--theme-border)] p-6">
                  {selectedAch.imageUrl ? (
                    <Image 
                      src={selectedAch.imageUrl} 
                      alt={selectedAch.title}
                      fill
                      className="object-contain"
                      quality={90}
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--theme-text-muted)] gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border)] shadow-inner text-[var(--theme-accent)]">
                        <Trophy size={44} />
                      </div>
                      <span className="text-sm font-semibold tracking-wider uppercase text-[var(--theme-text-secondary)]">Honors &amp; Competition Award</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {selectedAch.year && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-accent)] flex items-center gap-1.5">
                          <Calendar size={12} /> {selectedAch.year}
                        </span>
                      )}
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)]">
                        Achievement
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[var(--theme-text-primary)] leading-tight">
                      {selectedAch.title}
                    </h2>
                  </div>

                  {selectedAch.description && (
                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-3">Award Overview &amp; Context</h4>
                      <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">
                        {selectedAch.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedAch(null)}
                      className="px-6 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedAch.credentialUrl && (
                      <a 
                        href={selectedAch.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-xl shadow-[var(--theme-accent-glow)]"
                      >
                        <ExternalLink size={16} /> View Official Award / Credential
                      </a>
                    )}
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
