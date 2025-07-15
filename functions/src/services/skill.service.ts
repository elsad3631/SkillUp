import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const skillService = {
  async createSkill(data: any) {
    return await prisma.employeeSkill.create({
      data
    });
  },

  async getAllSkills() {
    return await prisma.employeeSkill.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async getSkillById(id: string) {
    const skill = await prisma.employeeSkill.findUnique({
      where: { id }
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    return skill;
  },

  async updateSkill(id: string, data: any) {
    return await prisma.employeeSkill.update({
      where: { id },
      data
    });
  },

  async deleteSkill(id: string) {
    return await prisma.employeeSkill.delete({
      where: { id }
    });
  }
}; 