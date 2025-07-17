import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const notificationService = {
  async getAll() {
    return prisma.notification.findMany({
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async getById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  async getByRecipientId(recipientId: string, limit?: number) {
    return prisma.notification.findMany({
      where: { recipientId },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 50,
    });
  },

  async getUnreadByRecipientId(recipientId: string, limit?: number) {
    return prisma.notification.findMany({
      where: { 
        recipientId,
        isRead: false,
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 50,
    });
  },

  async getByType(type: string, limit?: number) {
    return prisma.notification.findMany({
      where: { type },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 50,
    });
  },

  async getByPriority(priority: string, limit?: number) {
    return prisma.notification.findMany({
      where: { priority },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 50,
    });
  },

  async create(data: {
    recipientId: string;
    senderId?: string;
    type: string;
    title: string;
    message: string;
    priority?: string;
    actionUrl?: string;
    metadata?: any;
    expiresAt?: Date;
  }) {
    return prisma.notification.create({
      data: {
        ...data,
        priority: data.priority || 'MEDIUM',
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  async sendMessage(data: {
    recipientId: string;
    senderId: string;
    title: string;
    message: string;
    priority?: string;
  }) {
    return this.create({
      ...data,
      type: 'MESSAGE',
      priority: data.priority || 'MEDIUM',
    });
  },

  async sendSystemNotification(data: {
    recipientId: string;
    title: string;
    message: string;
    type: string;
    priority?: string;
    actionUrl?: string;
    metadata?: any;
  }) {
    return this.create({
      ...data,
      priority: data.priority || 'MEDIUM',
    });
  },

  async sendCVProcessingComplete(recipientId: string, cvData: any) {
    return this.create({
      recipientId,
      type: 'CV_PROCESSING_COMPLETE',
      title: 'CV Processing Complete',
      message: `Your CV "${cvData.fileName}" has been successfully processed and analyzed.`,
      priority: 'HIGH',
      actionUrl: `/employee/profile/${recipientId}`,
      metadata: {
        cvId: cvData.id,
        fileName: cvData.fileName,
      },
    });
  },

  async sendProjectAssignment(recipientId: string, projectData: any) {
    return this.create({
      recipientId,
      type: 'PROJECT_ASSIGNMENT',
      title: 'New Project Assignment',
      message: `You have been assigned to project "${projectData.name}" as ${projectData.roleOnProject}.`,
      priority: 'HIGH',
      actionUrl: `/project/${projectData.id}`,
      metadata: {
        projectId: projectData.id,
        projectName: projectData.name,
        role: projectData.roleOnProject,
      },
    });
  },

  async sendTaskCompletion(recipientId: string, taskData: any) {
    return this.create({
      recipientId,
      type: 'TASK_COMPLETION',
      title: 'Task Completed',
      message: `Task "${taskData.name}" has been completed successfully.`,
      priority: 'MEDIUM',
      actionUrl: `/project/${taskData.projectId}`,
      metadata: {
        taskId: taskData.id,
        taskName: taskData.name,
        projectId: taskData.projectId,
      },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { 
        recipientId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  async update(id: string, data: {
    title?: string;
    message?: string;
    priority?: string;
    actionUrl?: string;
    metadata?: any;
    expiresAt?: Date;
  }) {
    return prisma.notification.update({
      where: { id },
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  async remove(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  },

  async removeExpired() {
    const now = new Date();
    return prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
  },

  async getUnreadCount(recipientId: string) {
    return prisma.notification.count({
      where: {
        recipientId,
        isRead: false,
      },
    });
  },

  async getStats() {
    const totalNotifications = await prisma.notification.count();
    const unreadNotifications = await prisma.notification.count({
      where: { isRead: false },
    });
    const readNotifications = await prisma.notification.count({
      where: { isRead: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNotifications = await prisma.notification.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const messageNotifications = await prisma.notification.count({
      where: { type: 'MESSAGE' },
    });

    const systemNotifications = await prisma.notification.count({
      where: { type: { not: 'MESSAGE' } },
    });

    return {
      total: totalNotifications,
      unread: unreadNotifications,
      read: readNotifications,
      today: todayNotifications,
      messages: messageNotifications,
      system: systemNotifications,
    };
  },
}; 