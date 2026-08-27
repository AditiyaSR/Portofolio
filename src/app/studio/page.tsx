import { prisma } from "@/lib/prisma";
import StudioClient from "./StudioClient";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  try {
    const profile = await prisma.profile.findFirst().catch(() => null);
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } }).catch(() => []);

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
    console.error("StudioPage database query fallback:", error);
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
