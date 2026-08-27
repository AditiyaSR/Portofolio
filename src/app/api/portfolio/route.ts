import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    const education = await prisma.education.findMany({ orderBy: { order: 'asc' } });
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
    const certificates = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });

    return NextResponse.json({
      profile,
      experiences,
      education,
      projects,
      skills,
      achievements,
      certificates,
    });
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
