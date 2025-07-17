import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userActivityLogService = {
  async getAll() {
    return prisma.userActivityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  },

  async getById(id: string) {
    return prisma.userActivityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  },

  async getByUserId(userId: string, limit?: number) {
    return prisma.userActivityLog.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit || 50,
    });
  },

  async getByAction(action: string, limit?: number) {
    return prisma.userActivityLog.findMany({
      where: { action },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit || 50,
    });
  },

  async getByEntityType(entityType: string, limit?: number) {
    return prisma.userActivityLog.findMany({
      where: { entityType },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit || 50,
    });
  },

  async getByDateRange(startDate: Date, endDate: Date, limit?: number) {
    return prisma.userActivityLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit || 100,
    });
  },

  async getByStatus(status: string, limit?: number) {
    return prisma.userActivityLog.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit || 50,
    });
  },

  async create(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    status: string;
    errorMessage?: string;
    metadata?: any;
  }) {
    return prisma.userActivityLog.create({
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  },

  async logSuccess(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    return this.create({
      ...data,
      status: 'SUCCESS',
    });
  },

  async logError(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    description: string;
    errorMessage: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    return this.create({
      ...data,
      status: 'FAILED',
    });
  },

  async logPending(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    return this.create({
      ...data,
      status: 'PENDING',
    });
  },

  async update(id: string, data: {
    status?: string;
    errorMessage?: string;
    metadata?: any;
  }) {
    return prisma.userActivityLog.update({
      where: { id },
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  },

  async remove(id: string) {
    return prisma.userActivityLog.delete({
      where: { id },
    });
  },

  async removeOldLogs(daysOld: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return prisma.userActivityLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });
  },

  async getStats() {
    const totalLogs = await prisma.userActivityLog.count();
    const successLogs = await prisma.userActivityLog.count({
      where: { status: 'SUCCESS' },
    });
    const failedLogs = await prisma.userActivityLog.count({
      where: { status: 'FAILED' },
    });
    const pendingLogs = await prisma.userActivityLog.count({
      where: { status: 'PENDING' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await prisma.userActivityLog.count({
      where: {
        timestamp: {
          gte: today,
        },
      },
    });

    return {
      total: totalLogs,
      success: successLogs,
      failed: failedLogs,
      pending: pendingLogs,
      today: todayLogs,
    };
  },
}; 