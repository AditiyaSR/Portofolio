import { prisma } from "./prisma";

export async function ensureDatabaseSeeded() {
  try {
    const existingProfile = await prisma.profile.findFirst();
    if (existingProfile) {
      return; // Already populated
    }

    console.log("Empty database detected. Auto-seeding initial portfolio data...");

    // 1. Profile
    await prisma.profile.create({
      data: {
        name: "Aditiya Syaiful Ramadhan",
        title: "Mechanical Engineer & Materials Specialist",
        bio: "Highly motivated Mechanical Engineering graduate specializing in Materials Science. Proven track record in energy-efficiency vehicle competitions, internal combustion engine optimization, and integrating core mechanical principles with technical automation.",
        email: "aditiya.syaiful.ramadhan@gmail.com",
        phone: "+62895412368595",
        location: "Blitar, Jawa Timur, Indonesia",
        linkedinUrl: "https://www.linkedin.com/in/aditiya-syaiful-ramadhan-4ab380153",
        githubUrl: "https://github.com/AditiyaSR",
        avatarUrl: "/profile.png",
        mechanicalCvUrl: "/CV Aditsr.pdf",
        softwareCvUrl: "/CV Aditsr.pdf",
        resumeUrl: "/CV Aditsr.pdf",
      }
    });

    // 2. Experience
    await prisma.experience.createMany({
      data: [
        {
          role: "Lead Mechanic Team",
          company: "Kontes Mobil Hemat Energi",
          companyUrl: "https://kmhe.kemdikbud.go.id/",
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_unej.png",
          location: "Jember, East Java",
          startDate: "Oct 2025",
          endDate: "Present",
          isCurrent: true,
          description: "Led the mechanical division as a participant for the Tawang Alun Unej team. Achieved 3rd Place in the Prototype Category: Internal Combustion Engine (MPD) Diesel.",
          mode: "MECHANICAL",
          order: 1
        },
        {
          role: "Industrial Practice Work",
          company: "PT. Cheil Jedang Indonesia",
          companyUrl: "https://www.cj.co.id/",
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/CJ_logo.svg",
          location: "Pasuruan, Jawa Timur",
          startDate: "Feb 2025",
          endDate: "Mar 2025",
          isCurrent: false,
          description: "Executed pump repair protocols to minimize downtime. Spearheaded analysis of PA Fan blower failures, performed precision blower reconditioning, and analyzed bearing failures to support data-driven maintenance.",
          mode: "MECHANICAL",
          order: 2
        },
        {
          role: "Mechanical Team Member",
          company: "Shell Eco Marathon Asia Pacific",
          companyUrl: "https://www.makethefuture.shell/en-gb/shell-eco-marathon",
          logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e8/Shell_logo.svg",
          location: "Lombok Tengah, NTB",
          startDate: "Jun 2024",
          endDate: "Jun 2024",
          isCurrent: false,
          description: "Engineered and optimized internal combustion engine parameters to achieve maximum fuel efficiency under strict international regulations. Collaborated with international team members.",
          mode: "MECHANICAL",
          order: 3
        },
        {
          role: "Full-Stack Software Engineer (Contract)",
          company: "Freelance",
          companyUrl: "https://upwork.com",
          logoUrl: "https://cdn.simpleicons.org/upwork/14A800",
          location: "Remote",
          startDate: "2022",
          endDate: "2023",
          isCurrent: false,
          description: "Built high-performance SaaS platforms and internal tools utilizing Next.js 16, Prisma, and PostgreSQL. Developed modern dual-mode portfolio systems with real-time CMS automation.",
          mode: "SOFTWARE",
          order: 4
        }
      ]
    });

    // 3. Education
    await prisma.education.createMany({
      data: [
        {
          institution: "Universitas Jember",
          institutionUrl: "https://unej.ac.id",
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_unej.png",
          degree: "Bachelor's degree",
          major: "Mechanical Engineering",
          location: "Jember, Jawa Timur",
          startDate: "Aug 2022",
          endDate: "Jul 2026",
          gpa: "3.77",
          description: "Materials specialization emphasizing properties of Metals, Polymers, Composites, and Materials Extraction. Served as Mechanical Division Leader in an energy-efficient vehicle research team.",
          mode: "BOTH",
          order: 1
        }
      ]
    });

    // 4. Projects
    await prisma.project.createMany({
      data: [
        {
          title: "Biocomposite Films Research",
          category: "Materials Science",
          year: "2026",
          description: "Completed undergraduate thesis successfully formulating and testing biocomposite films using Polyvinyl Alcohol and mahogany wood powder.",
          mode: "MECHANICAL",
          order: 1
        },
        {
          title: "PA Fan Blower Bearing Analysis",
          category: "Industrial Maintenance",
          year: "2025",
          description: "Analyzed bearing damage on the blower PA fan at the boiler site at PT Cheil Jedang Indonesia.",
          mode: "MECHANICAL",
          order: 2
        },
        {
          title: "MPD Diesel Gen 5 Conversion",
          category: "Automotive Engineering",
          year: "2024",
          description: "Planned and converted conventional diesel engines to common rail MPD Diesel Gen 5. Developed prototype transmission systems.",
          mode: "MECHANICAL",
          order: 3
        },
        {
          title: "Precision CAD Agent",
          category: "Agentic Architecture",
          year: "2024",
          description: "Developed an industrial-grade agentic pipeline generating high-fidelity mechanical geometry in SolidWorks using Gemini Flash models.",
          mode: "SOFTWARE",
          demoUrl: "https://github.com/AditiyaSR",
          order: 4
        },
        {
          title: "Automated Portfolio CMS",
          category: "Full-Stack Web App",
          year: "2024",
          description: "Built a fully autonomous, visual-editable Next.js CMS with 'Liquid Glass' UI/UX, integrating Prisma and Vercel Blob storage.",
          mode: "SOFTWARE",
          demoUrl: "https://github.com/AditiyaSR",
          order: 5
        },
        {
          title: "SamFW Automation Script",
          category: "Security & Scripts",
          year: "2023",
          description: "Auth bypass and automated firmware flashing tool for Samsung devices built with Python and MTK VCOM utilities.",
          mode: "SOFTWARE",
          demoUrl: "https://github.com/AditiyaSR",
          order: 6
        }
      ]
    });

    // 5. Skills
    await prisma.skill.createMany({
      data: [
        { name: "SolidWorks", category: "HARD_SKILL", mode: "MECHANICAL", order: 1 },
        { name: "Internal Combustion Engine Optimization", category: "HARD_SKILL", mode: "MECHANICAL", order: 2 },
        { name: "Material Testing", category: "HARD_SKILL", mode: "MECHANICAL", order: 3 },
        { name: "Technical Scripting", category: "HARD_SKILL", mode: "BOTH", order: 4 },
        { name: "Data Analysis", category: "HARD_SKILL", mode: "MECHANICAL", order: 5 },
        { name: "Next.js 16", category: "HARD_SKILL", mode: "SOFTWARE", order: 6 },
        { name: "TypeScript", category: "HARD_SKILL", mode: "SOFTWARE", order: 7 },
        { name: "Python", category: "HARD_SKILL", mode: "SOFTWARE", order: 8 },
        { name: "Prisma ORM", category: "HARD_SKILL", mode: "SOFTWARE", order: 9 },
        { name: "PostgreSQL", category: "HARD_SKILL", mode: "SOFTWARE", order: 10 },
        { name: "Agentic AI", category: "HARD_SKILL", mode: "SOFTWARE", order: 11 },
        { name: "Project Management", category: "SOFT_SKILL", mode: "BOTH", order: 12 },
        { name: "Public Speaking", category: "SOFT_SKILL", mode: "BOTH", order: 13 },
      ]
    });

    // 6. Achievements
    await prisma.achievement.createMany({
      data: [
        {
          title: "3rd Place - Kontes Mobil Hemat Energi",
          year: "2025",
          description: "Prototype Category of MPD Diesel Class at the national Kontes Mobil Hemat Energi 2025.",
          credentialUrl: "https://kmhe.kemdikbud.go.id/",
          mode: "MECHANICAL",
          order: 1
        },
        {
          title: "6th Place - Shell Eco Marathon Asia Pacific",
          year: "2024",
          description: "Prototype Category Internal Combustion Engine Category at Mandalika International Circuit.",
          credentialUrl: "https://www.makethefuture.shell/en-gb/shell-eco-marathon",
          mode: "MECHANICAL",
          order: 2
        },
        {
          title: "Best Internal Tool Automation",
          year: "2023",
          description: "Awarded for saving over 500 engineering hours annually through custom scripts.",
          credentialUrl: "https://github.com/AditiyaSR",
          mode: "SOFTWARE",
          order: 3
        }
      ]
    });

    // 7. Certificates
    await prisma.certificate.createMany({
      data: [
        {
          title: "Certified SolidWorks Professional (CSWP)",
          issuer: "Dassault Systèmes",
          issueDate: "2024",
          expiryDate: "Permanent",
          credentialId: "C-SWP-8829104",
          credentialUrl: "https://www.solidworks.com/certifications",
          mode: "MECHANICAL",
          order: 1
        },
        {
          title: "Advanced Internal Combustion Engine Tuning",
          issuer: "Society of Automotive Engineers (SAE)",
          issueDate: "2024",
          expiryDate: "Permanent",
          credentialId: "SAE-ENG-2024-918",
          credentialUrl: "https://www.sae.org/",
          mode: "MECHANICAL",
          order: 2
        },
        {
          title: "Professional Full-Stack Web Development",
          issuer: "Meta / Coursera",
          issueDate: "2023",
          expiryDate: "Permanent",
          credentialId: "META-FS-449102",
          credentialUrl: "https://coursera.org",
          mode: "SOFTWARE",
          order: 3
        }
      ]
    });

    console.log("Auto-seeding completed successfully!");
  } catch (error) {
    console.error("Error during auto-seeding:", error);
  }
}
