import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const projectService = {
  async getAll() {
    const projects = await prisma.project.findMany({
      include: { requiredHardSkills: true },
    });
    // Map requiredHardSkills to camelCase in the response
    return projects.map((project: any) => ({
      ...project,
      requiredHardSkills: project.requiredHardSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        minProficiencyLevel: skill.minProficiencyLevel,
        isMandatory: skill.isMandatory,
      })) || [],
    }));
  },
  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { requiredHardSkills: true },
    });
    if (!project) return null;
    return {
      ...project,
      requiredHardSkills: project.requiredHardSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        minProficiencyLevel: skill.minProficiencyLevel,
        isMandatory: skill.isMandatory,
      })) || [],
    };
  },
  async create(data: any) {
    // Mappatura dei dati secondo lo schema Prisma
    const {
      name,
      description,
      status,
      manager_id,
      start_date,
      end_date,
      budget,
      priority,
      required_hard_skills,
      required_soft_skills,
    } = data;

    // Mappo le hard skills come relazione annidata
    const prismaData: any = {
      name,
      description,
      status,
      managerId: manager_id,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      budget,
      priority,
      requiredSoftSkills: required_soft_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [],
    };

    if (required_hard_skills && Array.isArray(required_hard_skills) && required_hard_skills.length > 0) {
      prismaData.requiredHardSkills = {
        create: required_hard_skills.map((skill: any) => ({
          name: skill.name,
          minProficiencyLevel: Number(skill.minProficiencyLevel || skill.min_proficiency_level || 1),
          isMandatory: skill.isMandatory ?? skill.is_mandatory ?? false,
        })),
      };
    }

    return prisma.project.create({ data: prismaData });
  },
  async update(id: string, data: any) {
    // Mappa solo i campi semplici
    const {
      name,
      description,
      status,
      manager_id,
      start_date,
      end_date,
      budget,
      priority,
      required_soft_skills,
      // required_hard_skills, // <-- NON USARE QUI
    } = data;

    const prismaData: any = {
      name,
      description,
      status,
      managerId: manager_id,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      budget,
      priority,
      requiredSoftSkills: required_soft_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [],
    };

    return prisma.project.update({ where: { id }, data: prismaData });
  },
  async remove(id: string) {
    return prisma.project.delete({ where: { id } });
  },
  async createSkillRequirement(data: any) {
    // data: { projectId, name, minProficiencyLevel, isMandatory }
    return prisma.skillRequirement.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        minProficiencyLevel: Number(data.minProficiencyLevel || 1),
        isMandatory: data.isMandatory ?? false,
      },
    });
  },
  async updateSkillRequirement(id: string, data: any) {
    return prisma.skillRequirement.update({
      where: { id },
      data: {
        name: data.name,
        minProficiencyLevel: Number(data.minProficiencyLevel || 1),
        isMandatory: data.isMandatory ?? false,
      },
    });
  },
  async deleteSkillRequirement(id: string) {
    return prisma.skillRequirement.delete({ where: { id } });
  },
}; 