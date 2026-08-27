"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Define a simple passcode check (in production, use proper auth or env variables)
const STUDIO_PASSCODE = process.env.STUDIO_PASSCODE || "admin123";

export async function verifyPasscode(passcode: string) {
  return passcode === STUDIO_PASSCODE;
}

// PROFILE ACTIONS
export async function updateProfile(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    await prisma.profile.update({
      where: { id },
      data: rest,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateProfile error:", error);
    return { success: false, error: error.message };
  }
}

// EXPERIENCE ACTIONS
export async function createExperience(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newExp = await prisma.experience.create({ data: rest });
    revalidatePath("/");
    return { success: true, experience: newExp };
  } catch (error: any) {
    console.error("createExperience error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExperience(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.experience.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateExperience error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteExperience error:", error);
    return { success: false, error: error.message };
  }
}

// PROJECT ACTIONS
export async function createProject(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newProj = await prisma.project.create({ data: rest });
    revalidatePath("/");
    return { success: true, project: newProj };
  } catch (error: any) {
    console.error("createProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.project.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteProject error:", error);
    return { success: false, error: error.message };
  }
}

// SKILL ACTIONS
export async function createSkill(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newSkill = await prisma.skill.create({ data: rest });
    revalidatePath("/");
    return { success: true, skill: newSkill };
  } catch (error: any) {
    console.error("createSkill error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSkill(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.skill.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateSkill error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSkill(id: string) {
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteSkill error:", error);
    return { success: false, error: error.message };
  }
}

// EDUCATION ACTIONS
export async function createEducation(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newEdu = await prisma.education.create({ data: rest });
    revalidatePath("/");
    return { success: true, education: newEdu };
  } catch (error: any) {
    console.error("createEducation error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEducation(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.education.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateEducation error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEducation(id: string) {
  try {
    await prisma.education.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteEducation error:", error);
    return { success: false, error: error.message };
  }
}

// ACHIEVEMENT ACTIONS
export async function createAchievement(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newAch = await prisma.achievement.create({ data: rest });
    revalidatePath("/");
    return { success: true, achievement: newAch };
  } catch (error: any) {
    console.error("createAchievement error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAchievement(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.achievement.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateAchievement error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAchievement(id: string) {
  try {
    await prisma.achievement.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAchievement error:", error);
    return { success: false, error: error.message };
  }
}

// CERTIFICATE ACTIONS
export async function createCertificate(data: any) {
  try {
    const { id, createdAt, updatedAt, ...rest } = data;
    const newCert = await prisma.certificate.create({ data: rest });
    revalidatePath("/");
    return { success: true, certificate: newCert };
  } catch (error: any) {
    console.error("createCertificate error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCertificate(id: string, data: any) {
  try {
    const { id: _, createdAt, updatedAt, ...rest } = data;
    await prisma.certificate.update({ where: { id }, data: rest });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateCertificate error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certificate.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteCertificate error:", error);
    return { success: false, error: error.message };
  }
}
