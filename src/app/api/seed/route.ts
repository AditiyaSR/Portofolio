import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.profile.deleteMany({});
    await prisma.experience.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.achievement.deleteMany({});
    await prisma.certificate.deleteMany({});

    await prisma.profile.create({
      data: {
        name: "Aditiya Syaiful Ramadhan",
        title: "Mechanical Engineer & Materials Specialist",
        bio: "Highly motivated Mechanical Engineering graduate specializing in Materials Science. Proven track record in energy-efficiency vehicle competitions, internal combustion engine optimization, and integrating core mechanical principles with technical automation.",
        email: "aditiya-syaiful-ramadhan-4ab380153@linkedin.com",
        phone: "+62895412368595",
        location: "Blitar, Jawa Timur, Indonesia",
        linkedinUrl: "https://www.linkedin.com/in/aditiya-syaiful-ramadhan-4ab380153",
        githubUrl: "",
        avatarUrl: "/profile.png"
      }
    });

    await prisma.experience.createMany({
      data: [
        {
          role: "Lead Mechanic Team",
          company: "Kontes Mobil Hemat Energi",
          companyUrl: "https://kmhe.kemdikbud.go.id/",
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
          location: "Remote",
          startDate: "2022",
          endDate: "2023",
          isCurrent: false,
          description: "Built high-performance SaaS platforms and internal tools utilizing Next.js 16, Prisma, and PostgreSQL. Developed 'Everything Claude Code' architecture for highly scalable automated agent systems.",
          mode: "SOFTWARE",
          order: 4
        }
      ]
    });

    await prisma.education.createMany({
      data: [
        {
          institution: "Universitas Jember",
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
          title: "NexusQuant HFT System",
          category: "Algorithmic Trading",
          year: "2026",
          description: "Autonomous High-Frequency Trading system with Rust, Cython, and Python. Features DRL-enhanced market making and Delta-Neutral funding arbitrage.",
          imageUrl: "/projects/nexusquant.png",
          mode: "SOFTWARE",
          order: 4
        },
        {
          title: "RV-NOS XAUUSD Scalper",
          category: "Quantitative Finance",
          year: "2026",
          description: "Regime-Adaptive Volatility-Normalized OFI Scalping System for MT5. Engineered 13 core math modules using native MQL5 and Python validation suites.",
          mode: "SOFTWARE",
          order: 5
        },
        {
          title: "Universal ATS CV Generator",
          category: "AI SaaS Platform",
          year: "2026",
          description: "AI-powered Next.js application that optimizes CVs to bypass ATS systems, generating compliant .docx files using Vercel AI SDK and OpenAI.",
          imageUrl: "/projects/ats_cv.png",
          mode: "SOFTWARE",
          order: 6
        },
        {
          title: "Shopee Factory Automations",
          category: "Automation & AI",
          year: "2025",
          description: "End-to-end Python engine for Shopee Affiliate automation, utilizing Gemini Vision AI to generate product video scripts and visual overlays.",
          imageUrl: "/projects/shopee_factory.png",
          mode: "SOFTWARE",
          order: 7
        },
        {
          title: "Project OMEGA Framework",
          category: "Quant Research",
          year: "2025",
          description: "Autonomous quantitative research framework for futures markets. Features ensemble agents and probability engines without relying on standard indicators.",
          mode: "SOFTWARE",
          order: 8
        },
        {
          title: "Asrofi Laboratorium Platform",
          category: "Web Development",
          year: "2025",
          description: "Interactive biocomposite research lab website featuring WebGL 3D backgrounds (Three.js), a secured Admin CMS panel, and full i18n support.",
          imageUrl: "/projects/asrofi_lab.png",
          mode: "SOFTWARE",
          order: 9
        },
        {
          title: "Aditiya Sprint AI",
          category: "Mobile Native",
          year: "2024",
          description: "Native Android APK for B2B sales tracking and daily productivity. Embedded with an OpenAI API mentor interface directly inside the app.",
          mode: "SOFTWARE",
          order: 10
        }
      ]
    });

    await prisma.skill.createMany({
      data: [
        { name: "SolidWorks", category: "HARD_SKILL", mode: "MECHANICAL", order: 1 },
        { name: "Internal Combustion Engine Optimization", category: "HARD_SKILL", mode: "MECHANICAL", order: 2 },
        { name: "Material Testing", category: "HARD_SKILL", mode: "MECHANICAL", order: 3 },
        { name: "Data Analysis", category: "HARD_SKILL", mode: "MECHANICAL", order: 5 },
        { name: "Next.js 16", category: "HARD_SKILL", mode: "SOFTWARE", order: 6 },
        { name: "TypeScript", category: "HARD_SKILL", mode: "SOFTWARE", order: 7 },
        { name: "Python", category: "HARD_SKILL", mode: "SOFTWARE", order: 8 },
        { name: "Prisma ORM", category: "HARD_SKILL", mode: "SOFTWARE", order: 9 },
        { name: "PostgreSQL", category: "HARD_SKILL", mode: "SOFTWARE", order: 10 },
        { name: "Agentic AI", category: "HARD_SKILL", mode: "SOFTWARE", order: 11 },
        { name: "Project Management", category: "SOFT_SKILL", mode: "BOTH", order: 12 },
        { name: "Public Speaking", category: "SOFT_SKILL", mode: "BOTH", order: 13 },
        { name: "Technical Scripting", category: "HARD_SKILL", mode: "BOTH", order: 4 },
      ]
    });

    await prisma.achievement.createMany({
      data: [
        {
          title: "3rd Place - Kontes Mobil Hemat Energi",
          year: "2025",
          description: "Prototype Category of MPD Diesel Class at the national Kontes Mobil Hemat Energi 2025.",
          credentialUrl: "https://kemdikbud.go.id/prestasi",
          mode: "MECHANICAL",
          order: 1
        },
        {
          title: "6th Place - Shell Eco Marathon Asia Pacific",
          year: "2024",
          description: "Prototype Category Internal Combustion Engine Category.",
          credentialUrl: "https://www.makethefuture.shell/en-gb/shell-eco-marathon",
          mode: "MECHANICAL",
          order: 2
        },
        {
          title: "Sertifikat Mobil Irit Tawang Alun",
          year: "2024",
          description: "Awarded for the design and efficiency achievement in the energy-saving vehicle competition.",
          mode: "MECHANICAL",
          order: 3
        },
        {
          title: "Sertifikat UNEJ BATTLE",
          year: "2023",
          description: "Participated and excelled in the university-level UNEJ Battle competition.",
          mode: "BOTH",
          order: 4
        },
        {
          title: "Sertifikat Panitia CS",
          year: "2024",
          description: "Served as a key committee member for the CS 2024 event, ensuring operational success.",
          mode: "BOTH",
          order: 5
        }
      ]
    });

    await prisma.certificate.createMany({
      data: [
        {
          title: "Certified SOLIDWORKS Associate (CSWA)",
          issuer: "Dassault Systèmes",
          issueDate: "2024",
          mode: "MECHANICAL",
          order: 1
        },
        {
          title: "Certificate Aditiya Syaiful Ramadhan",
          issuer: "Professional Authority",
          issueDate: "2024",
          mode: "BOTH",
          order: 2
        }
      ]
    });

    return NextResponse.json({ success: true, message: "Production Database Force Seeded Successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
