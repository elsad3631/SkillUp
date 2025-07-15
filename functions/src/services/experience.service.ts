import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const experienceService = {
  async createExperience(data: any) {
    return await prisma.experience.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    });
  },

  async getAllExperiences() {
    return await prisma.experience.findMany({
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  },

  async getExperienceById(id: string) {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!experience) {
      throw new Error('Experience not found');
    }

    return experience;
  },

  async updateExperience(id: string, data: any) {
    return await prisma.experience.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    });
  },

  async deleteExperience(id: string) {
    return await prisma.experience.delete({
      where: { id }
    });
  }
}; 