import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const projectService = {
  async createProject(data: any) {
    const { requiredHardSkills, requiredSoftSkills, ...projectData } = data;
    
    return await prisma.project.create({
      data: {
        ...projectData,
        requiredHardSkills: {
          create: requiredHardSkills?.map((skill: any) => ({
            name: skill.name,
            minProficiencyLevel: skill.minProficiencyLevel,
            isMandatory: skill.isMandatory,
            certification: skill.certification
          })) || []
        },
        requiredSoftSkills: {
          create: requiredSoftSkills?.map((skill: any) => ({
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel,
            isMandatory: skill.isMandatory,
            certification: skill.certification
          })) || []
        }
      },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      }
    });
  },

  async getAllProjects() {
    return await prisma.project.findMany({
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  },

  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true,
                hardSkills: true,
                softSkills: true
              }
            }
          }
        }
      }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  async updateProject(id: string, data: any) {
    const { requiredHardSkills, requiredSoftSkills, ...projectData } = data;
    
    // Delete existing skills first
    await prisma.projectSkill.deleteMany({
      where: {
        OR: [
          { projectHardId: id },
          { projectSoftId: id }
        ]
      }
    });

    return await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        requiredHardSkills: {
          create: requiredHardSkills?.map((skill: any) => ({
            name: skill.name,
            minProficiencyLevel: skill.minProficiencyLevel,
            isMandatory: skill.isMandatory,
            certification: skill.certification
          })) || []
        },
        requiredSoftSkills: {
          create: requiredSoftSkills?.map((skill: any) => ({
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel,
            isMandatory: skill.isMandatory,
            certification: skill.certification
          })) || []
        }
      },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      }
    });
  },

  async deleteProject(id: string) {
    // Check if project has active assignments
    const activeAssignments = await prisma.projectAssignment.count({
      where: {
        projectId: id,
        status: 'active'
      }
    });

    if (activeAssignments > 0) {
      throw new Error('Cannot delete project with active assignments');
    }

    return await prisma.project.delete({
      where: { id }
    });
  },

  async getProjectsByStatus(status: string) {
    return await prisma.project.findMany({
      where: { status },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  },

  async getProjectsByManager(managerId: string) {
    return await prisma.project.findMany({
      where: { managerId },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  },

  async assignUserToProject(projectId: string, assignmentData: any) {
    // Check if user is already assigned to this project
    const existingAssignment = await prisma.projectAssignment.findFirst({
      where: {
        projectId,
        applicationUserId: assignmentData.applicationUserId,
        status: 'active'
      }
    });

    if (existingAssignment) {
      throw new Error('User is already assigned to this project');
    }

    // Check if user has availability
    const user = await prisma.applicationUser.findUnique({
      where: { id: assignmentData.applicationUserId }
    });

    if (!user?.isAvailable) {
      throw new Error('User is not available for assignment');
    }

    return await prisma.projectAssignment.create({
      data: {
        ...assignmentData,
        status: 'active'
      },
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    });
  },

  async removeUserFromProject(projectId: string, userId: string) {
    const assignment = await prisma.projectAssignment.findFirst({
      where: {
        projectId,
        applicationUserId: userId,
        status: 'active'
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return await prisma.projectAssignment.update({
      where: { id: assignment.id },
      data: {
        status: 'completed',
        assignmentEndDate: new Date()
      }
    });
  },

  async getProjectAssignments(projectId: string) {
    return await prisma.projectAssignment.findMany({
      where: { projectId },
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
            hardSkills: true,
            softSkills: true
          }
        }
      }
    });
  },

  async updateProjectAssignment(assignmentId: string, data: any) {
    return await prisma.projectAssignment.update({
      where: { id: assignmentId },
      data,
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    });
  },

  async searchProjects(searchTerm: string) {
    return await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { status: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        requiredHardSkills: true,
        requiredSoftSkills: true,
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                currentRole: true,
                department: true
              }
            }
          }
        }
      }
    });
  },

  async getProjectStats() {
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: 'active' }
    });
    const completedProjects = await prisma.project.count({
      where: { status: 'completed' }
    });
    const plannedProjects = await prisma.project.count({
      where: { status: 'planned' }
    });

    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      planned: plannedProjects
    };
  }
}; 