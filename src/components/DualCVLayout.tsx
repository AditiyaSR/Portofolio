"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { ExperienceList } from "./ExperienceList";
import { EducationList } from "./EducationList";
import { ProjectsGrid } from "./ProjectsGrid";
import { CompetenciesList } from "./CompetenciesList";
import { AchievementList } from "./AchievementList";
import { CertificatesList } from "./CertificatesList";
import { ContactSection } from "./ContactSection";
import { SoftwareStack } from "./SoftwareStack";
import { GlassCard } from "./GlassCard";
import { Footer } from "./Footer";

type Props = {
  profile: any;
  experiences: any[];
  education: any[];
  projects: any[];
  skills: any[];
  achievements: any[];
  certificates?: any[];
};

export function DualCVLayout({ profile, experiences, education, projects, skills, achievements, certificates = [] }: Props) {
  const [mode, setMode] = useState<"MECHANICAL" | "SOFTWARE">("MECHANICAL");
  const isSoftware = mode === "SOFTWARE";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isSoftware ? "software" : "mechanical");
  }, [isSoftware]);

  // Filter data based on selected mode
  const activeExperiences = experiences.filter(e => e.mode === mode || e.mode === "BOTH");
  const activeEducation = education.filter(e => e.mode === mode || e.mode === "BOTH");
  const activeProjects = projects.filter(e => e.mode === mode || e.mode === "BOTH");
  const activeSkills = skills.filter(e => e.mode === mode || e.mode === "BOTH");
  const activeAchievements = achievements.filter(e => e.mode === mode || e.mode === "BOTH");
  const activeCertificates = certificates.filter(c => c.mode === mode || c.mode === "BOTH");

  // Robust Name Parsing for 1-word, 2-word, or multi-word names
  const nameParts = (profile.name || '').trim().split(/\s+/);
  let firstName = '';
  let middleName = '';
  let lastName = '';

  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length > 2) {
    firstName = nameParts[0];
    middleName = nameParts.slice(1, -1).join(' ');
    lastName = nameParts[nameParts.length - 1];
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-700 font-sans relative overflow-hidden bg-[var(--theme-bg-base)]"
      data-theme={isSoftware ? "software" : "mechanical"}
    >
      {/* SUBTLE AMBIENT CORNER GLOW (OUTSIDE CONTENT BOUNDARIES) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-700">
        {/* Top-Right Ambient Corner Glow */}
        <div 
          className={`absolute top-[-20%] right-[-15%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-[0.14] dark:opacity-[0.20] transition-colors duration-700 ${
            isSoftware ? "bg-gradient-to-br from-cyan-400 to-blue-600" : "bg-gradient-to-br from-rose-500 to-red-600"
          }`} 
        />
        {/* Bottom-Left Ambient Corner Glow */}
        <div 
          className={`absolute bottom-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-[0.12] dark:opacity-[0.18] transition-colors duration-700 ${
            isSoftware ? "bg-gradient-to-tr from-blue-700 to-cyan-500" : "bg-gradient-to-tr from-red-700 to-rose-600"
          }`} 
        />
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
      </div>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-32 md:py-40 relative z-10">
        
        {/* MODE TOGGLE SWITCH (AT THE VERY TOP) */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] p-1.5 rounded-full flex shadow-2xl backdrop-blur-md transition-colors duration-500 relative w-fit mx-auto">
            
            {/* The sliding pill background - Crisp Vivid Gradient */}
            <div 
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-48 rounded-full transition-transform duration-500 ease-out shadow-lg ${
                isSoftware 
                  ? "translate-x-48 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/30" 
                  : "translate-x-0 bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30"
              }`} 
            />

            <button 
              onClick={() => setMode("MECHANICAL")} 
              className={`relative w-48 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${!isSoftware ? "text-white" : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"}`}
            >
              <span className="relative z-10">Mechanical Engineering</span>
            </button>
            <button 
              onClick={() => setMode("SOFTWARE")} 
              className={`relative w-48 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${isSoftware ? "text-white" : "text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"}`}
            >
              <span className="relative z-10">Software Engineering</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <HeroSection 
          firstName={firstName}
          middleName={middleName}
          lastName={lastName}
          bio={isSoftware 
            ? "Full-Stack Software Engineer specializing in scalable SaaS architectures, Next.js optimization, and Agentic AI workflows."
            : profile.bio || "Mechanical Engineer specializing in Materials Science, Internal Combustion Engine Optimization, and Automated Workflows."
          }
          linkedinUrl={profile.linkedinUrl}
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          mechanicalCvUrl={profile.mechanicalCvUrl}
          softwareCvUrl={profile.softwareCvUrl}
          resumeUrl={profile.resumeUrl}
          isSoftware={isSoftware}
        />

        {/* DYNAMIC CV CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full text-[var(--theme-text-primary)]"
          >
            {/* BENTO GRID (ASYMMETRIC PROPORTIONAL) */}
            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[auto] gap-6">
              
              {!isSoftware ? (
                <>
                  {/* MECHANICAL LAYOUT: Experience First (7/5 Ratio) */}
                  <GlassCard className="col-span-1 md:col-span-7 p-8 flex flex-col min-h-[300px]">
                    <section id="experience" aria-labelledby="experience-heading">
                      <h2 id="experience-heading" className="font-display text-balance text-2xl mb-6">Professional Experience</h2>
                      <ExperienceList experiences={activeExperiences} />
                    </section>
                  </GlassCard>

                  <GlassCard className="col-span-1 md:col-span-5 p-8 flex flex-col min-h-[300px]">
                    <section id="education" aria-labelledby="education-heading">
                      <h2 id="education-heading" className="font-display text-balance text-2xl mb-6">Education</h2>
                      <EducationList education={activeEducation} />
                    </section>
                  </GlassCard>

                  <div id="projects" className="col-span-1 md:col-span-12 scroll-mt-24 mt-4">
                    <h2 className="font-display text-balance text-2xl mb-6 pl-2">Selected Projects</h2>
                    <ProjectsGrid projects={activeProjects} />
                  </div>
                </>
              ) : (
                <>
                  {/* SOFTWARE LAYOUT: Projects First (7/5 Ratio) */}
                  <div id="projects" className="col-span-1 md:col-span-12 scroll-mt-24 mb-4">
                    <h2 className="font-display text-balance text-2xl mb-6 pl-2">Featured Products & Architectures</h2>
                    <ProjectsGrid projects={activeProjects} />
                  </div>

                  <GlassCard className="col-span-1 md:col-span-7 p-8 flex flex-col min-h-[300px]">
                    <section id="experience" aria-labelledby="experience-heading">
                      <h2 id="experience-heading" className="font-display text-balance text-2xl mb-6">Engineering Roles</h2>
                      <ExperienceList experiences={activeExperiences} />
                    </section>
                  </GlassCard>

                  <GlassCard className="col-span-1 md:col-span-5 p-8 flex flex-col min-h-[300px]">
                    <section id="education" aria-labelledby="education-heading">
                      <h2 id="education-heading" className="font-display text-balance text-2xl mb-6">Education & Credentials</h2>
                      <EducationList education={activeEducation} />
                    </section>
                  </GlassCard>
                </>
              )}

              {/* Achievements & Awards */}
              {activeAchievements.length > 0 && (
                <GlassCard className={`col-span-1 ${isSoftware ? 'md:col-span-12' : 'md:col-span-5'} p-8`}>
                  <section aria-labelledby="achievements-heading">
                    <h2 id="achievements-heading" className="font-display text-balance text-2xl mb-6">Achievements</h2>
                    <AchievementList achievements={activeAchievements} />
                  </section>
                </GlassCard>
              )}

              {/* Core Competencies */}
              <GlassCard className={`col-span-1 ${!isSoftware && activeAchievements.length > 0 ? 'md:col-span-7' : 'md:col-span-12'} p-8`}>
                <section aria-labelledby="skills-heading">
                  <h2 id="skills-heading" className="font-display text-balance text-2xl mb-6">Core Competencies</h2>
                  <CompetenciesList skills={activeSkills} />
                </section>
              </GlassCard>

              {/* Licenses & Certifications - Responsive Fluid Grid */}
              {activeCertificates.length > 0 && (
                <div id="certificates" className="col-span-1 md:col-span-12 scroll-mt-24 mt-4">
                  <div className="mb-6 pl-2">
                    <h2 className="font-display text-balance text-2xl">Licenses &amp; Certifications</h2>
                    <p className="text-sm text-[var(--theme-text-secondary)] mt-1">Verified industry credentials, authorizations, and accredited certifications.</p>
                  </div>
                  <CertificatesList certificates={activeCertificates} />
                </div>
              )}

              {/* Software Stack - Full Width */}
              <div className="col-span-1 md:col-span-12 py-12">
                <section aria-labelledby="software-heading">
                  <h2 id="software-heading" className="font-display text-balance text-2xl mb-2 text-center">Engineering Software Stack</h2>
                  <p className="text-[var(--color-text-secondary)] text-center mb-8">Primary tools utilized for design, analysis, and automation.</p>
                  <SoftwareStack isSoftware={isSoftware} />
                </section>
              </div>
            </div>

            {/* ELEGANT SECTION DIVIDER LINE */}
            <div className="my-20 relative flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--theme-border)] to-transparent" />
              <div className="absolute w-1/2 md:w-1/3 h-px bg-gradient-to-r from-transparent via-[var(--theme-accent)] to-transparent opacity-90" />
              <div className="absolute w-28 h-1 bg-[var(--theme-accent)] opacity-40 blur-sm rounded-full" />
            </div>

            {/* GENERAL INFORMATION / CONTACT - OUTSIDE THE GRID */}
            <div className="pb-8">
              <div className="max-w-4xl mx-auto">
                <ContactSection 
                  email={profile.email} 
                  phone={profile.phone}
                  location={profile.location}
                  linkedinUrl={profile.linkedinUrl} 
                  githubUrl={profile.githubUrl} 
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}
