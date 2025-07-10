import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const projectService = {
  async getAll() {
    const projects = await prisma.project.findMany({
      include: { 
        requiredHardSkills: true,
        requiredSoftSkills: true 
      },
    });
    // Map requiredHardSkills and requiredSoftSkills to camelCase in the response
    return projects.map((project: any) => ({
      ...project,
      requiredHardSkills: project.requiredHardSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        minProficiencyLevel: skill.minProficiencyLevel,
        certification: skill.certification,
        isMandatory: skill.isMandatory,
      })) || [],
      requiredSoftSkills: project.requiredSoftSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel,
        certification: skill.certification,
      })) || [],
    }));
  },
  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { 
        requiredHardSkills: true,
        requiredSoftSkills: true 
      },
    });
    if (!project) return null;
    return {
      ...project,
      requiredHardSkills: project.requiredHardSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        minProficiencyLevel: skill.minProficiencyLevel,
        certification: skill.certification,
        isMandatory: skill.isMandatory,
      })) || [],
      requiredSoftSkills: project.requiredSoftSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel,
        certification: skill.certification,
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

    // Mappo le skills come relazioni annidate
    const prismaData: any = {
      name,
      description,
      status,
      managerId: manager_id,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      budget,
      priority,
    };

    // Gestisci soft skills come relazione annidata (usando projectSoftId)
    if (required_soft_skills && Array.isArray(required_soft_skills) && required_soft_skills.length > 0) {
      prismaData.requiredSoftSkills = {
        create: required_soft_skills.map((skill: any) => ({
          name: typeof skill === 'string' ? skill : skill.name,
          proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
          certification: skill.certification || undefined,
          isMandatory: skill.isMandatory ?? false,
        })),
      };
    }

    // Gestisci hard skills come relazione annidata (usando projectHardId)
    if (required_hard_skills && Array.isArray(required_hard_skills) && required_hard_skills.length > 0) {
      prismaData.requiredHardSkills = {
        create: required_hard_skills.map((skill: any) => ({
          name: skill.name,
          minProficiencyLevel: Number(skill.minProficiencyLevel || skill.min_proficiency_level || 1),
          certification: skill.certification || undefined,
          isMandatory: skill.isMandatory ?? skill.is_mandatory ?? false,
        })),
      };
    }

    return prisma.project.create({ data: prismaData });
  },
  async update(id: string, data: any) {
    // Mappa solo i campi semplici - le skills vengono gestite tramite API separate
    const {
      name,
      description,
      status,
      manager_id,
      start_date,
      end_date,
      budget,
      priority,
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
    };

    return prisma.project.update({ where: { id }, data: prismaData });
  },
  async remove(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  async getUserProjects(userId: string) {
    const userProjects = await prisma.projectAssignment.findMany({
      where: {
        applicationUserId: userId,
      },
      include: {
        project: {
          include: {
            requiredHardSkills: true,
            requiredSoftSkills: true,
          },
        },
      },
    });

    return userProjects.map((assignment: any) => ({
      ...assignment.project,
      // Aggiungi info specifiche dell'assignment
      roleOnProject: assignment.roleOnProject,
      assignmentStartDate: assignment.assignmentStartDate,
      assignmentEndDate: assignment.assignmentEndDate,
      allocationPercentage: assignment.allocationPercentage,
      assignmentStatus: assignment.status,
      feedbackReceived: assignment.feedbackReceived,
      // Mappa le required skills come nel metodo getAll
      requiredHardSkills: assignment.project.requiredHardSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        minProficiencyLevel: skill.minProficiencyLevel,
        certification: skill.certification,
        isMandatory: skill.isMandatory,
      })) || [],
      requiredSoftSkills: assignment.project.requiredSoftSkills?.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel,
        certification: skill.certification,
      })) || [],
    }));
  },
}; 