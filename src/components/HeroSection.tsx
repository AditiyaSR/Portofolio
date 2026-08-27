import { motion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight, FileDown, Sparkles } from "lucide-react";
import { motionTokens } from "@/lib/motionTokens";

type Props = {
  firstName: string;
  middleName: string;
  lastName: string;
  bio: string | null;
  linkedinUrl: string | null;
  name: string;
  avatarUrl?: string | null;
  mechanicalCvUrl?: string | null;
  softwareCvUrl?: string | null;
  resumeUrl?: string | null;
  isSoftware?: boolean;
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: motionTokens.easing.spring } 
  },
};

export function HeroSection({ 
  firstName, 
  middleName, 
  lastName, 
  bio, 
  linkedinUrl, 
  name, 
  avatarUrl, 
  mechanicalCvUrl,
  softwareCvUrl,
  resumeUrl,
  isSoftware = false 
}: Props) {
  const activeCvUrl = isSoftware 
    ? (softwareCvUrl || resumeUrl || mechanicalCvUrl)
    : (mechanicalCvUrl || resumeUrl || softwareCvUrl);

  const handleDownloadCV = () => {
    if (activeCvUrl) {
      window.open(activeCvUrl, "_blank");
    } else {
      window.print();
    }
  };

  return (
    <motion.section 
      id="hero" 
      className="mb-32 pt-10" 
      aria-labelledby="hero-heading"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div variants={item}>
          <h1 id="hero-heading" className="font-display text-balance text-6xl md:text-8xl md:text-[7rem] tracking-tighter font-medium leading-[0.9] mb-8">
            {lastName ? (
              <>
                <span className="block text-[var(--theme-text-primary)]">{[firstName, middleName].filter(Boolean).join(' ')}</span>
                <span className="block text-[var(--theme-accent)]">{lastName}</span>
              </>
            ) : (
              <span className="block text-[var(--theme-accent)]">{firstName}</span>
            )}
          </h1>
          
          <motion.div className="mt-10 md:mt-12" variants={item}>
            <p className="text-pretty text-xl md:text-2xl text-[var(--theme-text-secondary)] font-light leading-snug max-w-xl">
              {bio || "Mechanical Engineer specializing in Materials Science, Internal Combustion Engine Optimization, and Automated Workflows."}
            </p>

            {/* ACTION BUTTONS: LINKEDIN & DOWNLOAD CV */}
            <motion.div className="flex flex-wrap gap-4 mt-8" variants={item}>
              {activeCvUrl ? (
                <a
                  href={activeCvUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className={`group hit-area-min flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${
                    isSoftware 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]" 
                      : "bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                  }`}
                  aria-label={`Download ${isSoftware ? "Software" : "Mechanical"} CV`}
                >
                  <FileDown size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span>Download {isSoftware ? "Software" : "Mechanical"} CV</span>
                </a>
              ) : (
                <button
                  onClick={handleDownloadCV}
                  className={`group hit-area-min flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${
                    isSoftware 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]" 
                      : "bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                  }`}
                  aria-label={`Download ${isSoftware ? "Software" : "Mechanical"} CV`}
                >
                  <FileDown size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span>Download {isSoftware ? "Software" : "Mechanical"} CV</span>
                </button>
              )}

              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group hit-area-min flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-card)]/60 backdrop-blur-md hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] text-sm font-medium transition-all duration-300 text-[var(--theme-text-primary)] hover:shadow-lg"
                  aria-label={`Visit ${name}'s LinkedIn Profile`}
                >
                  LinkedIn 
                  <ArrowUpRight 
                    size={16} 
                    aria-hidden="true" 
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                  />
                </a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative w-full flex md:justify-end"
          variants={{
            hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)", rotate: -5 },
            visible: { 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              filter: "blur(0px)",
              transition: { duration: 1.2, ease: motionTokens.easing.spring }
            }
          }}
        >
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-[var(--theme-border)] shadow-2xl relative bg-zinc-900 group">
            {/* Liquid Glass Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-accent)]/10 via-transparent to-white/5 opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10 pointer-events-none" />
            <Image 
              src={avatarUrl || "/profile.png"} 
              alt={name} 
              fill 
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
              priority 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
