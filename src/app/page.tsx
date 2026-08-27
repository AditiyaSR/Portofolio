import { prisma } from "@/lib/prisma";
import { DualCVLayout } from "@/components/DualCVLayout";
import { ensureDatabaseSeeded } from "@/lib/ensureSeeded";

export const revalidate = 60;

export default async function Home() {
  try {
    await ensureDatabaseSeeded();

    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
    
    if (!profile) {
      throw new Error("Profile not found after seeding");
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
  } catch (error) {
    console.error("Home page query error, rendering with fallback:", error);
    return null;
  }
}
