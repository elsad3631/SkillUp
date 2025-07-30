import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auditLogService = {
  async getAll() {
    return prisma.auditLog.findMany({
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
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
      }
    });
  },

  async getByUserId(userId: string) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: {
        timestamp: 'desc'
      }
    });
  },

  async getByAction(action: string) {
    return prisma.auditLog.findMany({
      where: { action },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getByEntityType(entityType: string) {
    return prisma.auditLog.findMany({
      where: { entityType },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getByEntity(entityType: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { 
        entityType,
        entityId 
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getBySeverity(severity: string) {
    return prisma.auditLog.findMany({
      where: { severity },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getByDateRange(startDate: Date, endDate: Date) {
    return prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getRecentLogs(hours: number = 24) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    return prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async getCriticalLogs() {
    return prisma.auditLog.findMany({
      where: {
        severity: 'CRITICAL'
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        description: data.description,
        severity: data.severity || 'INFO',
      },
      include: {
        user: {
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
      }
    });
  },

  async remove(id: string) {
    return prisma.auditLog.delete({
      where: { id }
    });
  },

  async removeOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate
        }
      }
    });
  },

  async exportLogs(startDate: Date, endDate: Date, format: string = 'csv') {
    const logs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });

    if (format === 'json') {
      return { logs, format: 'json' };
    }

    // Simple CSV format
    const csvHeaders = 'ID,User,Action,Entity Type,Entity ID,Timestamp,Severity,Description\n';
    const csvRows = logs.map(log => 
      `${log.id},"${log.user?.username || 'Unknown'}",${log.action},${log.entityType},${log.entityId},${log.timestamp},${log.severity},"${log.description || ''}"`
    ).join('\n');

    return { 
      data: csvHeaders + csvRows, 
      format: 'csv',
      filename: `audit-logs-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`
    };
  },

  async getAuditStats() {
    const totalLogs = await prisma.auditLog.count();
    const infoLogs = await prisma.auditLog.count({
      where: { severity: 'INFO' }
    });
    const warningLogs = await prisma.auditLog.count({
      where: { severity: 'WARNING' }
    });
    const errorLogs = await prisma.auditLog.count({
      where: { severity: 'ERROR' }
    });
    const criticalLogs = await prisma.auditLog.count({
      where: { severity: 'CRITICAL' }
    });

    return {
      total: totalLogs,
      info: infoLogs,
      warning: warningLogs,
      error: errorLogs,
      critical: criticalLogs
    };
  },

  async getAuditStatsByUser(userId: string) {
    const userLogs = await prisma.auditLog.findMany({
      where: { userId }
    });

    const total = userLogs.length;
    const info = userLogs.filter(l => l.severity === 'INFO').length;
    const warning = userLogs.filter(l => l.severity === 'WARNING').length;
    const error = userLogs.filter(l => l.severity === 'ERROR').length;
    const critical = userLogs.filter(l => l.severity === 'CRITICAL').length;

    return {
      total,
      info,
      warning,
      error,
      critical
    };
  },

  async getAuditStatsByAction(action: string) {
    const actionLogs = await prisma.auditLog.findMany({
      where: { action }
    });

    const total = actionLogs.length;
    const info = actionLogs.filter(l => l.severity === 'INFO').length;
    const warning = actionLogs.filter(l => l.severity === 'WARNING').length;
    const error = actionLogs.filter(l => l.severity === 'ERROR').length;
    const critical = actionLogs.filter(l => l.severity === 'CRITICAL').length;

    return {
      total,
      info,
      warning,
      error,
      critical
    };
  },

  async searchAuditLogs(searchTerm: string) {
    return prisma.auditLog.findMany({
      where: {
        OR: [
          { action: { contains: searchTerm, mode: 'insensitive' } },
          { entityType: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { ipAddress: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        user: {
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
        timestamp: 'desc'
      }
    });
  }
}; 