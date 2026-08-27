import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/GlassCard";
import { ExperienceList } from "@/components/ExperienceList";
import { EducationList } from "@/components/EducationList";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { CompetenciesList } from "@/components/CompetenciesList";
import { AchievementList } from "@/components/AchievementList";
import { DualCVLayout } from "@/components/DualCVLayout";

export const revalidate = 60;

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
  const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
  
  if (!profile) {
    return (
      <div role="status" className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-display text-2xl">
        Initializing System...
      </div>
    );
  }

  return (
    <DualCVLayout 
      profile={profile}
      experiences={experiences}
      education={education}
      projects={projects}
      skills={skills}
      achievements={achievements}
      certificates={certificates}
    />
  );
}
