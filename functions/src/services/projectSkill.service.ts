import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const projectSkillService = {
  async createProjectSkill(data: any) {
    return await prisma.projectSkill.create({
      data
    });
  },

  async getAllProjectSkills() {
    return await prisma.projectSkill.findMany({
      include: {
        projectHard: {
          select: {
            id: true,
            name: true
          }
        },
        projectSoft: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  async getProjectSkillById(id: string) {
    const projectSkill = await prisma.projectSkill.findUnique({
      where: { id },
      include: {
        projectHard: {
          select: {
            id: true,
            name: true
          }
        },
        projectSoft: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!projectSkill) {
      throw new Error('Project skill not found');
    }

    return projectSkill;
  },

  async updateProjectSkill(id: string, data: any) {
    return await prisma.projectSkill.update({
      where: { id },
      data
    });
  },

  async deleteProjectSkill(id: string) {
    return await prisma.projectSkill.delete({
      where: { id }
    });
  },

  async getSkillsByProject(projectId: string) {
    return await prisma.projectSkill.findMany({
      where: {
        OR: [
          { projectHardId: projectId },
          { projectSoftId: projectId }
        ]
      },
      include: {
        projectHard: {
          select: {
            id: true,
            name: true
          }
        },
        projectSoft: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
}; 