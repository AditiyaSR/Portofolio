"use client";

import { Mail, Check, Copy, Sparkles, MapPin, Phone, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { motionTokens } from "@/lib/motionTokens";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type Props = {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
};

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: motionTokens.easing.smooth } 
  },
};

export function ContactSection({ email, phone, location, linkedinUrl, githubUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--theme-accent)] text-zinc-950 font-bold shadow-2xl backdrop-blur-md text-sm border border-white/20"
          >
            <Check size={18} strokeWidth={2.5} />
            <span>Email copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="p-8 sm:p-12 md:p-14 relative overflow-hidden border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 transition-all duration-500 shadow-2xl">
        {/* Top glowing gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-accent-gradient)] opacity-80" />

        {/* Ambient Corner Glow inside card */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[var(--theme-accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[var(--theme-accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />

        <motion.section 
          id="contact" 
          aria-labelledby="contact-heading" 
          className="flex flex-col items-center text-center gap-8 relative z-10"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Availability Status Badge */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-bg-base)] border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text-primary)] shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Open for New Opportunities &amp; Engineering Projects</span>
            </div>
          </motion.div>

          {/* Heading and Description */}
          <motion.div variants={item} className="max-w-xl mx-auto space-y-3">
            <h2 id="contact-heading" className="font-display text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--theme-text-primary)]">
              Let&apos;s Build <span className="text-[var(--theme-accent)]">Something.</span>
            </h2>
            <p className="text-pretty text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed">
              Whether you have a breakthrough engineering concept, a consulting inquiry, or a job opportunity, feel free to get in touch!
            </p>
          </motion.div>
          
          {/* Action Buttons Grid */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-4 sm:gap-5 w-full max-w-lg">
            {email && (
              <>
                <a
                  href={`mailto:${email}`}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--theme-accent)] text-zinc-950 font-bold hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-[var(--theme-accent-glow)] text-sm"
                  aria-label="Send Direct Email"
                >
                  <Send size={16} strokeWidth={2.5} />
                  <span>Direct Mail</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--theme-bg-base)] hover:bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-[var(--theme-text-primary)] font-bold active:scale-95 transition-all duration-300 shadow-sm text-sm cursor-pointer"
                  aria-label="Copy Email to Clipboard"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-[var(--theme-accent)]" />}
                  <span>{copied ? "Copied!" : "Copy Email"}</span>
                </button>
              </>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--theme-bg-base)] hover:bg-[#0A66C2]/10 border border-[var(--theme-border)] hover:border-[#0A66C2] text-[var(--theme-text-primary)] hover:text-[#0A66C2] font-bold active:scale-95 transition-all duration-300 shadow-sm text-sm"
                aria-label="Visit LinkedIn Profile"
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--theme-bg-base)] hover:bg-zinc-800 border border-[var(--theme-border)] hover:border-[var(--theme-text-primary)] text-[var(--theme-text-primary)] font-bold active:scale-95 transition-all duration-300 shadow-sm text-sm"
                aria-label="Visit GitHub Profile"
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
            )}
          </motion.div>

          {/* Quick Contact Badges (Location / Phone) */}
          {(location || phone) && (
            <motion.div variants={item} className="pt-6 border-t border-[var(--theme-border)]/60 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--theme-text-muted)] font-medium">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[var(--theme-accent)]" /> {location}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-[var(--theme-accent)]" /> {phone}
                </span>
              )}
            </motion.div>
          )}
        </motion.section>
      </GlassCard>
    </div>
  );
}
