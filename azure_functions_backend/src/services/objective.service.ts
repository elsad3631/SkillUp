import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const objectiveService = {
  async getAll() {
    return prisma.objective.findMany({
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.objective.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async getByAssignedUser(userId: string) {
    return prisma.objective.findMany({
      where: { assignedTo: userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getByAssignedTo(userId: string) {
    return this.getByAssignedUser(userId);
  },

  async getByPriority(priority: string) {
    return prisma.objective.findMany({
      where: { priority },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getObjectivesDueSoon(days: number = 7) {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + days);

    return prisma.objective.findMany({
      where: {
        status: 'IN_PROGRESS',
        endDate: {
          gte: today,
          lte: thresholdDate
        }
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async assignObjective(id: string, assignedTo: string) {
    return prisma.objective.update({
      where: { id },
      data: { assignedTo },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.objective.update({
      where: { id },
      data: { status },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async completeObjective(id: string, completionNotes?: string) {
    return prisma.objective.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        description: completionNotes ? `${completionNotes}` : undefined // Use description field
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async getByProjectId(projectId: string) {
    return prisma.objective.findMany({
      where: { projectId },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.objective.findMany({
      where: { status },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getByCategory(category: string) {
    return prisma.objective.findMany({
      where: { category },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getActiveObjectives() {
    return prisma.objective.findMany({
      where: { status: 'ACTIVE' },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async getOverdueObjectives() {
    const today = new Date();
    return prisma.objective.findMany({
      where: {
        endDate: {
          lt: today
        },
        status: {
          in: ['ACTIVE', 'IN_PROGRESS']
        }
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });
  },

  async create(data: any) {
    return prisma.objective.create({
      data: {
        title: data.title,
        description: data.description,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || 'ACTIVE',
        priority: data.priority || 'MEDIUM',
        assignedTo: data.assignedTo,
        projectId: data.projectId,
        category: data.category,
        progress: data.progress || 0,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.objective.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        projectId: data.projectId,
        category: data.category,
        progress: data.progress,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async remove(id: string) {
    return prisma.objective.delete({
      where: { id }
    });
  },

  async updateProgress(id: string, currentValue: number) {
    const objective = await prisma.objective.findUnique({
      where: { id }
    });

    if (!objective) {
      throw new Error('Objective not found');
    }

    const progress = objective.targetValue 
      ? Math.min((currentValue / objective.targetValue) * 100, 100)
      : 0;

    const status = progress >= 100 ? 'COMPLETED' : 
                   progress > 0 ? 'IN_PROGRESS' : 'ACTIVE';

    return prisma.objective.update({
      where: { id },
      data: {
        currentValue,
        progress,
        status
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async cancelObjective(id: string) {
    return prisma.objective.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });
  },

  async getObjectiveStats() {
    const totalObjectives = await prisma.objective.count();
    const activeObjectives = await prisma.objective.count({
      where: { status: 'ACTIVE' }
    });
    const completedObjectives = await prisma.objective.count({
      where: { status: 'COMPLETED' }
    });
    const inProgressObjectives = await prisma.objective.count({
      where: { status: 'IN_PROGRESS' }
    });
    const overdueObjectives = await prisma.objective.count({
      where: {
        endDate: {
          lt: new Date()
        },
        status: {
          in: ['ACTIVE', 'IN_PROGRESS']
        }
      }
    });

    return {
      total: totalObjectives,
      active: activeObjectives,
      completed: completedObjectives,
      inProgress: inProgressObjectives,
      overdue: overdueObjectives,
      completionRate: totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0
    };
  },

  async getObjectiveStatsByUser(userId: string) {
    const userObjectives = await prisma.objective.findMany({
      where: { assignedTo: userId }
    });

    const active = userObjectives.filter(o => o.status === 'ACTIVE').length;
    const completed = userObjectives.filter(o => o.status === 'COMPLETED').length;
    const inProgress = userObjectives.filter(o => o.status === 'IN_PROGRESS').length;
    const overdue = userObjectives.filter(o => 
      o.endDate && o.endDate < new Date() && ['ACTIVE', 'IN_PROGRESS'].includes(o.status)
    ).length;
    const total = userObjectives.length;

    return {
      total,
      active,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async getObjectiveStatsByProject(projectId: string) {
    const projectObjectives = await prisma.objective.findMany({
      where: { projectId }
    });

    const active = projectObjectives.filter(o => o.status === 'ACTIVE').length;
    const completed = projectObjectives.filter(o => o.status === 'COMPLETED').length;
    const inProgress = projectObjectives.filter(o => o.status === 'IN_PROGRESS').length;
    const overdue = projectObjectives.filter(o => 
      o.endDate && o.endDate < new Date() && ['ACTIVE', 'IN_PROGRESS'].includes(o.status)
    ).length;
    const total = projectObjectives.length;

    return {
      total,
      active,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async searchObjectives(searchTerm: string) {
    return prisma.objective.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            currentRole: true,
            department: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}; 