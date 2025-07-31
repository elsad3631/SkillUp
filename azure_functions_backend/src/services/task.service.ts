import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const taskService = {
  async getAll() {
    return prisma.task.findMany({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.task.findUnique({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async getByAssignedUser(userId: string) {
    return prisma.task.findMany({
      where: { assignedTo: userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async getByAssignedTo(userId: string) {
    return this.getByAssignedUser(userId);
  },

  async getByCreatedBy(userId: string) {
    return prisma.task.findMany({
      where: { createdBy: userId },
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
        dueDate: 'asc'
      }
    });
  },

  async getTasksDueSoon(days: number = 7) {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + days);

    return prisma.task.findMany({
      where: {
        status: { not: 'COMPLETED' },
        dueDate: {
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async assignTask(id: string, assignedTo: string) {
    return prisma.task.update({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.task.update({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async updatePriority(id: string, priority: string) {
    return prisma.task.update({
      where: { id },
      data: { priority },
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async getByProjectId(projectId: string) {
    return prisma.task.findMany({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.task.findMany({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async getByPriority(priority: string) {
    return prisma.task.findMany({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async getOverdueTasks() {
    const today = new Date();
    return prisma.task.findMany({
      where: {
        dueDate: {
          lt: today
        },
        status: {
          notIn: ['COMPLETED', 'CANCELLED']
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  },

  async getDueToday() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lt: tomorrow
        },
        status: {
          notIn: ['COMPLETED', 'CANCELLED']
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        priority: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        projectId: data.projectId,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'TODO',
        dueDate: data.dueDate,
        startDate: data.startDate,
        completedDate: data.completedDate,
        estimatedHours: data.estimatedHours,
        actualHours: data.actualHours,
        tags: data.tags || [],
        attachments: data.attachments || [],
        createdBy: data.createdBy,
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        projectId: data.projectId,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
        startDate: data.startDate,
        completedDate: data.completedDate,
        estimatedHours: data.estimatedHours,
        actualHours: data.actualHours,
        tags: data.tags,
        attachments: data.attachments,
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async remove(id: string) {
    return prisma.task.delete({
      where: { id }
    });
  },

  async startTask(id: string) {
    return prisma.task.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startDate: new Date()
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async completeTask(id: string, actualHours?: number) {
    return prisma.task.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        actualHours: actualHours
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async cancelTask(id: string) {
    return prisma.task.update({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  },

  async getTaskStats() {
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' }
    });
    const inProgressTasks = await prisma.task.count({
      where: { status: 'IN_PROGRESS' }
    });
    const todoTasks = await prisma.task.count({
      where: { status: 'TODO' }
    });
    const overdueTasks = await prisma.task.count({
      where: {
        dueDate: {
          lt: new Date()
        },
        status: {
          notIn: ['COMPLETED', 'CANCELLED']
        }
      }
    });

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      overdue: overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  },

  async getTaskStatsByUser(userId: string) {
    const userTasks = await prisma.task.findMany({
      where: { assignedTo: userId }
    });

    const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
    const inProgress = userTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todo = userTasks.filter(t => t.status === 'TODO').length;
    const overdue = userTasks.filter(t => 
      t.dueDate && t.dueDate < new Date() && !['COMPLETED', 'CANCELLED'].includes(t.status)
    ).length;
    const total = userTasks.length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async getTaskStatsByProject(projectId: string) {
    const projectTasks = await prisma.task.findMany({
      where: { projectId }
    });

    const completed = projectTasks.filter(t => t.status === 'COMPLETED').length;
    const inProgress = projectTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todo = projectTasks.filter(t => t.status === 'TODO').length;
    const overdue = projectTasks.filter(t => 
      t.dueDate && t.dueDate < new Date() && !['COMPLETED', 'CANCELLED'].includes(t.status)
    ).length;
    const total = projectTasks.length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  },

  async searchTasks(searchTerm: string) {
    return prisma.task.findMany({
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
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}; 