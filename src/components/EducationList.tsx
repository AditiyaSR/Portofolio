"use client";

import { useState, useEffect } from "react";
import type { Education } from "@/generated/prisma_client";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { motionTokens } from "@/lib/motionTokens";
import { GraduationCap, ExternalLink, MapPin, Calendar, X, Award } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
  education: Education[];
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

export function EducationList({ education }: Props) {
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe escape key listener with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEdu(null);
    };

    if (selectedEdu) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEdu]);

  if (education.length === 0) return <p className="text-[var(--theme-text-muted)] italic">No education data available.</p>;

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
        {education.map((edu) => (
          <motion.li 
            key={edu.id} 
            variants={item} 
            onClick={() => setSelectedEdu(edu)}
            className="group flex gap-4 p-5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/50 hover:bg-[var(--theme-bg-card)] hover:border-[var(--theme-accent)]/60 transition-all duration-300 relative cursor-pointer hover:shadow-lg hover:shadow-[var(--theme-accent-glow)]"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-[var(--theme-accent)] group-hover:h-3/4 transition-all duration-500 rounded-r-full opacity-0 group-hover:opacity-100" />

            {edu.logoUrl ? (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)] overflow-hidden relative shadow-sm group-hover:border-[var(--theme-accent)] transition-all">
                <Image 
                  src={edu.logoUrl} 
                  alt={edu.institution} 
                  fill 
                  className="object-contain p-2" 
                  unoptimized 
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:scale-105 transition-transform">
                <GraduationCap size={22} />
              </div>
            )}

            <div className="flex-grow">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <h3 className="text-lg font-bold group-hover:text-[var(--theme-accent)] transition-colors duration-300 text-[var(--theme-text-primary)] flex items-center gap-1.5">
                  {edu.institution}
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--theme-accent)]" />
                </h3>

                {edu.gpa && (
                  <span
                    className="tabular-nums inline-flex items-center px-3 py-0.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-base)] text-xs font-bold text-[var(--theme-accent)]"
                  >
                    GPA {edu.gpa}
                  </span>
                )}
              </div>

              <div className="text-[var(--theme-text-secondary)] text-sm mb-2 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--theme-text-primary)]">{edu.degree} in {edu.major}</span>
                {(edu.startDate || edu.endDate) && (
                  <>
                    <span className="text-[var(--theme-text-muted)]">&bull;</span>
                    <span className="text-xs text-[var(--theme-text-muted)]">{edu.startDate} - {edu.endDate}</span>
                  </>
                )}
                {edu.location && (
                  <>
                    <span className="text-[var(--theme-text-muted)]">&bull;</span>
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--theme-text-muted)]">
                      <MapPin size={12} /> {edu.location}
                    </span>
                  </>
                )}
              </div>

              {edu.description && (
                <p className="text-pretty text-sm text-[var(--theme-text-secondary)] leading-relaxed group-hover:text-[var(--theme-text-primary)] transition-colors duration-300 line-clamp-2">
                  {edu.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/* Global Viewport Portal Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedEdu && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEdu(null)}
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
                  onClick={() => setSelectedEdu(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Media Section: Large Institution Emblem Header */}
                <div className="relative w-full aspect-video sm:max-h-[300px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-[var(--theme-border)] p-6">
                  {selectedEdu.logoUrl ? (
                    <div className="relative w-48 h-32">
                      <Image 
                        src={selectedEdu.logoUrl} 
                        alt={selectedEdu.institution}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--theme-text-muted)] gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border)] shadow-inner text-[var(--theme-accent)]">
                        <GraduationCap size={44} />
                      </div>
                      <span className="text-sm font-semibold tracking-wider uppercase text-[var(--theme-text-secondary)]">Higher Education &amp; Academics</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                        {selectedEdu.institution}
                      </span>
                      {(selectedEdu.startDate || selectedEdu.endDate) && (
                        <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5 font-medium bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                          <Calendar size={12} className="text-[var(--theme-accent)]" /> {selectedEdu.startDate} - {selectedEdu.endDate}
                        </span>
                      )}
                      {selectedEdu.gpa && (
                        <span className="text-xs font-bold text-[var(--theme-text-primary)] bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                          Cumulative GPA: {selectedEdu.gpa}
                        </span>
                      )}
                      {selectedEdu.location && (
                        <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5 bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                          <MapPin size={12} /> {selectedEdu.location}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[var(--theme-text-primary)] leading-tight">
                      {selectedEdu.degree} in {selectedEdu.major}
                    </h2>
                  </div>

                  {selectedEdu.description && (
                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-3">Academic Highlights &amp; Honors</h4>
                      <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">
                        {selectedEdu.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedEdu(null)}
                      className="px-6 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedEdu.institutionUrl && (
                      <a 
                        href={selectedEdu.institutionUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-xl shadow-[var(--theme-accent-glow)]"
                      >
                        <ExternalLink size={16} /> Visit Institution Website
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
