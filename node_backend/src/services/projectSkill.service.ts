import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const projectSkillService = {
  async getAll() {
    return prisma.projectSkill.findMany();
  },
  async getById(id: string) {
    return prisma.projectSkill.findUnique({ where: { id } });
  },
  async getHardSkillsByProjectId(projectId: string) {
    return prisma.projectSkill.findMany({ 
      where: { projectHardId: projectId } 
    });
  },
  async getSoftSkillsByProjectId(projectId: string) {
    return prisma.projectSkill.findMany({ 
      where: { projectSoftId: projectId } 
    });
  },
  async createHardSkill(data: any) {
    return prisma.projectSkill.create({ 
      data: {
        name: data.name,
        minProficiencyLevel: data.minProficiencyLevel,
        certification: data.certification,
        isMandatory: data.isMandatory,
        projectHardId: data.projectHardId || data.projectId,
      }
    });
  },
  async createSoftSkill(data: any) {
    return prisma.projectSkill.create({ 
      data: {
        name: data.name,
        proficiencyLevel: data.proficiencyLevel,
        certification: data.certification,
        isMandatory: data.isMandatory,
        projectSoftId: data.projectSoftId || data.projectId,
      }
    });
  },
  async update(id: string, data: any) {
    // Filter only allowed fields to prevent unwanted updates
    const allowedFields = {
      name: data.name,
      minProficiencyLevel: data.minProficiencyLevel,
      proficiencyLevel: data.proficiencyLevel,
      certification: data.certification,
      isMandatory: data.isMandatory,
    };
    
    // Remove undefined fields
    const filteredData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
    );
    
    return prisma.projectSkill.update({ where: { id }, data: filteredData });
  },
  async remove(id: string) {
    return prisma.projectSkill.delete({ where: { id } });
  },
  async removeHardSkillsByProjectId(projectId: string) {
    return prisma.projectSkill.deleteMany({ where: { projectHardId: projectId } });
  },
  async removeSoftSkillsByProjectId(projectId: string) {
    return prisma.projectSkill.deleteMany({ where: { projectSoftId: projectId } });
  },
}; 