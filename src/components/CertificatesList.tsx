"use client";

import type { Certificate } from "@prisma/client";
import { GlassCard } from "@/components/GlassCard";
import { motion, AnimatePresence } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import { ExternalLink, Calendar, CheckCircle2, ShieldCheck, X, Award, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  certificates: Certificate[];
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: motionTokens.easing.smooth } 
  },
};

export function CertificatesList({ certificates }: Props) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe escape key listener with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };

    if (selectedCert) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCert]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  if (!certificates || certificates.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--theme-bg-card)] border border-[var(--theme-border)] text-center">
        <p className="text-[var(--theme-text-muted)] italic text-sm">No certificates uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {certificates.map((cert) => (
          <motion.div key={cert.id} variants={item} className="h-full">
            <button
              onClick={() => setSelectedCert(cert)}
              className="text-left w-full h-full cursor-pointer focus:outline-none"
              aria-label={`View details for ${cert.title}`}
            >
              <GlassCard className="p-6 h-full flex flex-col justify-between group border-[var(--theme-border)] hover:border-[var(--theme-accent)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--theme-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  {/* Header: Issuer & Date */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] group-hover:border-[var(--theme-accent)]/50 transition-colors">
                      <ShieldCheck size={14} className="text-[var(--theme-accent)] shrink-0" />
                      <span className="text-xs font-semibold text-[var(--theme-text-primary)] truncate max-w-[150px]">
                        {cert.issuer}
                      </span>
                    </div>

                    {cert.issueDate && (
                      <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1 shrink-0 font-medium">
                        <Calendar size={12} /> {cert.issueDate}
                      </span>
                    )}
                  </div>

                  {/* Certificate Title */}
                  <h3 className="font-display font-semibold text-lg text-[var(--theme-text-primary)] group-hover:text-[var(--theme-accent)] transition-colors leading-snug mb-3 line-clamp-2">
                    {cert.title}
                  </h3>

                  {/* Optional Credential ID */}
                  {cert.credentialId && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--theme-bg-base)] text-[11px] font-mono text-[var(--theme-text-muted)] border border-[var(--theme-border)]">
                      <span>ID:</span>
                      <span className="text-[var(--theme-text-secondary)] select-all">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions & Image/Link */}
                <div className="pt-4 mt-auto border-t border-[var(--theme-border)] flex items-center justify-between gap-3">
                  {cert.imageUrl ? (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-bg-base)] shrink-0">
                      <Image src={cert.imageUrl} alt={cert.title} fill className="object-contain p-0.5" unoptimized />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                      <CheckCircle2 size={14} /> Verified
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--theme-bg-base)] group-hover:bg-[var(--theme-accent)] group-hover:text-zinc-950 text-xs font-semibold text-[var(--theme-text-primary)] border border-[var(--theme-border)] group-hover:border-[var(--theme-accent)] transition-all duration-300 shadow-sm">
                    View Details <ExternalLink size={12} />
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
          {selectedCert && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCert(null)}
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
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Media Section: Large Banner Preview */}
                <div className="relative w-full aspect-video sm:max-h-[360px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-[var(--theme-border)] p-6">
                  {selectedCert.imageUrl ? (
                    <Image 
                      src={selectedCert.imageUrl} 
                      alt={selectedCert.title}
                      fill
                      className="object-contain"
                      quality={90}
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--theme-text-muted)] gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--theme-bg-base)] flex items-center justify-center border border-[var(--theme-border)] shadow-inner text-[var(--theme-accent)]">
                        <ShieldCheck size={44} />
                      </div>
                      <span className="text-sm font-semibold tracking-wider uppercase text-[var(--theme-text-secondary)]">Verified Certificate &amp; License</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                          {selectedCert.issuer}
                        </span>
                        {selectedCert.issueDate && (
                          <span className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1 font-medium bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                            <Calendar size={12} className="text-[var(--theme-accent)]" /> Issued: {selectedCert.issueDate}
                          </span>
                        )}
                        {selectedCert.expiryDate && (
                          <span className="text-xs text-[var(--theme-text-muted)] bg-[var(--theme-bg-base)] border border-[var(--theme-border)] px-3 py-1 rounded-full">
                            Expires: {selectedCert.expiryDate}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[var(--theme-text-primary)] leading-tight">
                        {selectedCert.title}
                      </h2>
                    </div>
                  </div>

                  {selectedCert.credentialId && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--theme-bg-base)] border border-[var(--theme-border)]">
                      <div>
                        <span className="text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider block">Credential Identification</span>
                        <p className="font-mono text-sm sm:text-base text-[var(--theme-text-primary)] font-bold mt-0.5 select-all">
                          {selectedCert.credentialId}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyId(selectedCert.credentialId!)}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-xs font-semibold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId ? <Check size={14} className="text-emerald-400" /> : null}
                        {copiedId ? "Copied!" : "Copy ID"}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="px-6 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedCert.credentialUrl && (
                      <a 
                        href={selectedCert.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-xl shadow-[var(--theme-accent-glow)]"
                      >
                        <ExternalLink size={16} /> Verify Credential Online
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
