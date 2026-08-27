"use client";

import { useState, useEffect } from "react";
import type { Experience } from "@/generated/prisma_client";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { motionTokens } from "@/lib/motionTokens";
import { Building2, ExternalLink, MapPin, Calendar, X, Briefcase } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
  experiences: Experience[];
};

const getPresetLogo = (company: string) => {
  const lower = (company || "").toLowerCase();
  if (lower.includes('shell')) return 'https://upload.wikimedia.org/wikipedia/en/e/e8/Shell_logo.svg';
  if (lower.includes('cheil jedang') || lower.includes('cj')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e0/CJ_logo.svg';
  if (lower.includes('kontes mobil') || lower.includes('unej')) return 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_unej.png'; 
  if (lower.includes('freelance') || lower.includes('upwork')) return 'https://cdn.simpleicons.org/upwork/14A800'; 
  return null;
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

export function ExperienceList({ experiences }: Props) {
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe escape key listener with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedExp(null);
    };

    if (selectedExp) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedExp]);

  if (experiences.length === 0) return <p className="text-[var(--theme-text-muted)] italic">No experience data available.</p>;

  return (
    <>
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} onOpen={() => setSelectedExp(exp)} />
        ))}
      </motion.div>

      {/* Global Viewport Portal Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedExp && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedExp(null)}
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
                  onClick={() => setSelectedExp(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Media Section: Large Company Logo Header */}
                <div className="relative w-full aspect-video sm:max-h-[300px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-[var(--theme-border)] p-6">
                  {(selectedExp.logoUrl || getPresetLogo(selectedExp.company)) ? (
                    <div className="relative w-48 h-32">
                      <Image 
                        src={(selectedExp.logoUrl || getPresetLogo(selectedExp.company))!} 
                        alt={selectedExp.company}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--theme-text-muted)] gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border)] shadow-inner text-[var(--theme-accent)]">
                        <Building2 size={44} />
                      </div>
                      <span className="text-sm font-semibold tracking-wider uppercase text-[var(--theme-text-secondary)]">Professional Experience</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                        {selectedExp.company}
                      </span>
                      <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5 font-medium bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                        <Calendar size={12} className="text-[var(--theme-accent)]" /> {selectedExp.startDate} - {selectedExp.isCurrent ? "Present" : selectedExp.endDate}
                      </span>
                      {selectedExp.location && (
                        <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5 bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                          <MapPin size={12} /> {selectedExp.location}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[var(--theme-text-primary)] leading-tight">
                      {selectedExp.role}
                    </h2>
                  </div>

                  {selectedExp.description && (
                    <div className="p-6 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-3">Key Responsibilities &amp; Engineering Contributions</h4>
                      <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">
                        {selectedExp.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedExp(null)}
                      className="px-6 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedExp.companyUrl && (
                      <a 
                        href={selectedExp.companyUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-xl shadow-[var(--theme-accent-glow)]"
                      >
                        <ExternalLink size={16} /> Visit Company Website
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

function ExperienceCard({ exp, onOpen }: { exp: Experience; onOpen: () => void }) {
  const [imageError, setImageError] = useState(false);
  const activeLogo = exp.logoUrl || getPresetLogo(exp.company);

  return (
    <motion.div 
      variants={item} 
      onClick={onOpen}
      className="group relative flex flex-col sm:flex-row gap-5 p-6 rounded-3xl transition-all duration-300 bg-[var(--theme-bg-card)]/70 hover:bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 hover:shadow-xl hover:shadow-[var(--theme-accent-glow)] cursor-pointer hover:-translate-y-0.5"
    >
      {/* Logo container */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)] overflow-hidden relative shadow-sm transition-all duration-300 group-hover:border-[var(--theme-accent)] group-hover:scale-105">
          {activeLogo && !imageError ? (
            <Image 
              src={activeLogo} 
              alt={exp.company} 
              fill 
              className="object-contain p-2.5" 
              unoptimized 
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--theme-bg-card)] text-[var(--theme-text-secondary)] font-bold text-sm">
              <Building2 className="w-6 h-6 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-accent)] transition-colors duration-300" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-1.5 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-xl text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors">
              {exp.role}
            </h3>
            <span className="opacity-0 group-hover:opacity-100 text-[var(--theme-accent)] transition-all inline-flex items-center gap-1 text-xs font-semibold">
              <ExternalLink size={14} />
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-text-muted)] whitespace-nowrap bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full w-fit">
            <Calendar size={12} className="text-[var(--theme-accent)]" />
            {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[var(--theme-text-secondary)] font-medium text-sm">{exp.company}</span>
          {exp.location && (
            <>
              <span className="text-[var(--theme-text-muted)] text-xs">&bull;</span>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--theme-text-muted)] font-medium">
                <MapPin size={12} />
                {exp.location}
              </span>
            </>
          )}
        </div>

        {exp.description && (
          <p className="text-[var(--theme-text-secondary)] leading-relaxed text-sm line-clamp-2">
            {exp.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
