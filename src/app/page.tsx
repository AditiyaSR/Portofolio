import { prisma } from "@/lib/prisma";
import { DualCVLayout } from "@/components/DualCVLayout";

export const revalidate = 60;

export default async function Home() {
  try {
    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
    
    if (!profile) {
      console.warn("Profile not found in database. Using fallback minimal profile.");
      return (
        <DualCVLayout 
          profile={{
            id: "fallback",
            name: "Aditiya Syaiful Ramadhan",
            title: "Mechanical Engineer & Materials Specialist",
            bio: "Please run 'npx prisma db seed' to populate data.",
            email: "aditiya.syaiful.ramadhan@gmail.com",
            phone: "+62895412368595",
            location: "Blitar, Jawa Timur, Indonesia",
            linkedinUrl: "https://www.linkedin.com/in/aditiya-syaiful-ramadhan-4ab380153",
            githubUrl: "https://github.com/AditiyaSR",
            avatarUrl: "/profile.png",
            mechanicalCvUrl: "/CV Aditsr.pdf",
            softwareCvUrl: "/CV Aditsr.pdf",
            resumeUrl: "/CV Aditsr.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          experiences={experiences}
          education={education}
          projects={projects}
          skills={skills}
          achievements={achievements}
          certificates={certificates}
        />
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
  } catch (error) {
    console.error("Home page query error, rendering with error fallback:", error);
    // Render an error message instead of returning null
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
          <p className="text-gray-400">Failed to load portfolio data. If you are deploying on Vercel, ensure the SQLite database was seeded during the build process.</p>
        </div>
      </div>
    );
  }
}
