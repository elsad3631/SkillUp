import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const projectService = {
  async getAll(companyId?: string) {
    const whereClause = companyId ? { company: companyId } : {};
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: { 
        requiredHardSkills: true,
        requiredSoftSkills: true,
        companyUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
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
        requiredSoftSkills: true,
        companyUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
        assignments: {
          include: {
            applicationUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                currentRole: true,
                department: true,
                email: true,
              },
            },
          },
        },
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
      assignments: project.assignments?.map((assignment: any) => ({
        id: assignment.id,
        applicationUserId: assignment.applicationUserId,
        roleOnProject: assignment.roleOnProject,
        assignmentStartDate: assignment.assignmentStartDate,
        assignmentEndDate: assignment.assignmentEndDate,
        allocationPercentage: assignment.allocationPercentage,
        status: assignment.status,
        feedbackReceived: assignment.feedbackReceived,
        applicationUser: assignment.applicationUser,
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
      company,
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
      company,
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
      company,
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
      company,
    };

    return prisma.project.update({ where: { id }, data: prismaData });
  },
  async remove(id: string) {
    try {
      // Delete all project documents from blob storage
      try {
        // Import blob storage service dynamically to avoid circular dependencies
        const { blobStorageService } = await import('./blobstorage.service');
        
        // Get all project documents using the project documents prefix
        const projectDocumentsPrefix = `projects/${id}/documents/`;
        const projectDocuments = await blobStorageService.listFiles(projectDocumentsPrefix);
        
        if (projectDocuments.length > 0) {
          console.log(`Found ${projectDocuments.length} project documents to delete for project ${id}`);
          
          // Extract file names from blob items
          const documentFileNames = projectDocuments.map(blob => blob.name);
          
          // Delete files one by one, but don't fail if some don't exist
          for (const fileName of documentFileNames) {
            try {
              await blobStorageService.deleteFile(fileName);
              console.log(`Deleted project document: ${fileName}`);
            } catch (fileError) {
              console.warn(`Failed to delete project document ${fileName}:`, fileError);
              // Continue with other files even if one fails
            }
          }
          
          console.log(`Deleted ${documentFileNames.length} project documents for project ${id}`);
        }
      } catch (blobError) {
        console.warn('Error accessing blob storage service for project documents:', blobError);
        // Continue with database deletion even if document deletion fails
      }

      // Delete related project assignments first
      await prisma.projectAssignment.deleteMany({ where: { projectId: id } });
      
      // Now delete the project
      return prisma.project.delete({ where: { id } });
    } catch (error) {
      console.error('Error in project removal process:', error);
      throw error;
    }
  },

  async getUserProjects(userId: string) {
    // Prima ottieni l'utente per determinare la sua company
    const user = await prisma.applicationUser.findUnique({
      where: { id: userId },
      select: { company: true, userRoles: { include: { role: true } } }
    });

    if (!user) {
      return [];
    }

    // Determina se l'utente è superadmin
    const isSuperAdmin = user.userRoles?.some((ur: any) => ur.role.name === 'superadmin');
    
    // Costruisci la query per i progetti
    let projectWhereClause: any = {};
    
    if (isSuperAdmin) {
      // Se è superadmin, mostra tutti i progetti della sua company
      projectWhereClause.company = user.company || userId;
    } else {
      // Se non è superadmin, mostra solo i progetti della sua company
      projectWhereClause.company = user.company;
    }

    // Prima prova a ottenere i progetti assegnati all'utente
    const userProjects = await prisma.projectAssignment.findMany({
      where: {
        applicationUserId: userId,
        project: projectWhereClause,
      },
      include: {
        project: {
          include: {
            requiredHardSkills: true,
            requiredSoftSkills: true,
            companyUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                company: true,
              },
            },
            assignments: {
              include: {
                applicationUser: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    currentRole: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Se non ci sono progetti assegnati, ottieni tutti i progetti della company
    if (userProjects.length === 0) {
      const companyProjects = await prisma.project.findMany({
        where: projectWhereClause,
        include: {
          requiredHardSkills: true,
          requiredSoftSkills: true,
          companyUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true,
            },
          },
          assignments: {
            include: {
              applicationUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  currentRole: true,
                },
              },
            },
          },
        },
      });
      
      return companyProjects.map((project: any) => ({
        ...project,
        // Mappa le required skills come nel metodo getAll
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
    }

    return userProjects.map((assignment: any) => ({
      ...assignment.project,
      // Aggiungi info specifiche dell'assignment
      assignmentId: assignment.id, // ID dell'assignment per la rimozione
      roleOnProject: assignment.roleOnProject,
      assignmentStartDate: assignment.assignmentStartDate,
      assignmentEndDate: assignment.assignmentEndDate,
      allocationPercentage: assignment.allocationPercentage,
      assignmentStatus: assignment.status,
      feedbackReceived: assignment.feedbackReceived,
      // Aggiungi tutti gli utenti assegnati al progetto
      assignedUsers: assignment.project.assignments?.map((assign: any) => ({
        id: assign.applicationUser.id,
        name: `${assign.applicationUser.firstName || ''} ${assign.applicationUser.lastName || ''}`.trim(),
        firstName: assign.applicationUser.firstName,
        lastName: assign.applicationUser.lastName,
        avatar: assign.applicationUser.avatar,
        role: assign.roleOnProject,
        currentRole: assign.applicationUser.currentRole,
        allocationPercentage: assign.allocationPercentage,
      })) || [],
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

  async getProjectUsers(projectId: string) {
    const assignments = await prisma.projectAssignment.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        applicationUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            currentRole: true,
          },
        },
      },
    });

    return assignments.map((assignment: any) => ({
      id: assignment.applicationUser.id,
      name: `${assignment.applicationUser.firstName || ''} ${assignment.applicationUser.lastName || ''}`.trim(),
      firstName: assignment.applicationUser.firstName,
      lastName: assignment.applicationUser.lastName,
      avatar: assignment.applicationUser.avatar,
      role: assignment.roleOnProject,
      currentRole: assignment.applicationUser.currentRole,
      allocationPercentage: assignment.allocationPercentage,
      assignmentStartDate: assignment.assignmentStartDate,
      assignmentEndDate: assignment.assignmentEndDate,
      status: assignment.status,
    }));
  },
}; 