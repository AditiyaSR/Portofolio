import { prisma } from "@/lib/prisma";
import { DualCVLayout } from "@/components/DualCVLayout";

export const revalidate = 60;

const defaultProfile = {
  id: "default-profile",
  name: "Aditiya Syaiful Ramadhan",
  title: "Mechanical Engineer & Materials Specialist",
  bio: "Highly motivated Mechanical Engineering graduate specializing in Materials Science. Proven track record in energy-efficiency vehicle competitions, internal combustion engine optimization, and integrating core mechanical principles with technical automation.",
  email: "aditiya-syaiful-ramadhan-4ab380153@linkedin.com",
  phone: "+62895412368595",
  location: "Blitar, Jawa Timur, Indonesia",
  linkedinUrl: "https://www.linkedin.com/in/aditiya-syaiful-ramadhan-4ab380153",
  githubUrl: "",
  avatarUrl: "/profile.png",
  mechanicalCvUrl: "/CV Aditsr.pdf",
  softwareCvUrl: "/CV Aditsr.pdf",
  resumeUrl: "/CV Aditsr.pdf",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default async function Home() {
  try {
    const profile = (await prisma.profile.findFirst()) || defaultProfile;
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } }).catch(() => []);
    
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
    console.error("Database query fallback:", error);
    return (
      <DualCVLayout 
        profile={defaultProfile}
        experiences={[]}
        education={[]}
        projects={[]}
        skills={[]}
        achievements={[]}
        certificates={[]}
      />
    );
  }
}
