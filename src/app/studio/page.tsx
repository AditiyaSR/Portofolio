import { prisma } from "@/lib/prisma";
import StudioClient from "./StudioClient";
import { ensureDatabaseSeeded } from "@/lib/ensureSeeded";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  try {
    await ensureDatabaseSeeded();

    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });

    return (
      <div className="min-h-screen bg-[#05050a] text-gray-200 p-6">
        <StudioClient 
          initialProfile={profile} 
          initialExperiences={experiences} 
          initialEducation={education}
          initialProjects={projects} 
          initialSkills={skills} 
          initialAchievements={achievements}
          initialCertificates={certificates}
        />
      </div>
    );
  } catch (error) {
    console.error("StudioPage error:", error);
    return (
      <div className="min-h-screen bg-[#05050a] text-gray-200 p-6">
        <StudioClient 
          initialProfile={null} 
          initialExperiences={[]} 
          initialEducation={[]}
          initialProjects={[]} 
          initialSkills={[]} 
          initialAchievements={[]}
          initialCertificates={[]}
        />
      </div>
    );
  }
}
