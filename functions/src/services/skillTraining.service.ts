import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const skillTrainingService = {
  async createSkillTraining(data: any) {
    return await prisma.skillTraining.create({
      data
    });
  },

  async getAllSkillTrainings() {
    return await prisma.skillTraining.findMany({
      orderBy: { title: 'asc' }
    });
  },

  async getSkillTrainingById(id: string) {
    const skillTraining = await prisma.skillTraining.findUnique({
      where: { id }
    });

    if (!skillTraining) {
      throw new Error('Skill training not found');
    }

    return skillTraining;
  },

  async updateSkillTraining(id: string, data: any) {
    return await prisma.skillTraining.update({
      where: { id },
      data
    });
  },

  async deleteSkillTraining(id: string) {
    return await prisma.skillTraining.delete({
      where: { id }
    });
  }
}; 