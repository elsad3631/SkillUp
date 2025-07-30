import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const trainingEnrollmentService = {
  async getAll() {
    return prisma.trainingEnrollment.findMany({
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
        },
        training: true
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.trainingEnrollment.findUnique({
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
        },
        training: true
      }
    });
  },

  async getByUserId(userId: string) {
    return prisma.trainingEnrollment.findMany({
      where: { userId },
      include: {
        training: true
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });
  },

  async getByTrainingId(trainingId: string) {
    return prisma.trainingEnrollment.findMany({
      where: { trainingId },
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
        enrollmentDate: 'desc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.trainingEnrollment.findMany({
      where: { status },
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
        },
        training: true
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });
  },

  async getInProgressEnrollments() {
    return prisma.trainingEnrollment.findMany({
      where: { status: 'IN_PROGRESS' },
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
        },
        training: true
      },
      orderBy: {
        enrollmentDate: 'desc'
      }
    });
  },

  async getCompletedEnrollments() {
    return prisma.trainingEnrollment.findMany({
      where: { status: 'COMPLETED' },
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
        },
        training: true
      },
      orderBy: {
        completionDate: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.trainingEnrollment.create({
      data: {
        userId: data.userId,
        trainingId: data.trainingId,
        enrollmentDate: data.enrollmentDate || new Date(),
        status: data.status || 'PLANNED',
        completionDate: data.completionDate,
        score: data.score,
        certificateUrl: data.certificateUrl,
        notes: data.notes,
        progress: data.progress || 0,
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
        },
        training: true
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.trainingEnrollment.update({
      where: { id },
      data: {
        status: data.status,
        completionDate: data.completionDate,
        score: data.score,
        certificateUrl: data.certificateUrl,
        notes: data.notes,
        progress: data.progress,
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
        },
        training: true
      }
    });
  },

  async remove(id: string) {
    return prisma.trainingEnrollment.delete({
      where: { id }
    });
  },

  async updateProgress(id: string, progress: number) {
    return prisma.trainingEnrollment.update({
      where: { id },
      data: {
        progress: progress,
        status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        completionDate: progress >= 100 ? new Date() : undefined,
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
        },
        training: true
      }
    });
  },

  async completeEnrollment(id: string, score?: number, certificateUrl?: string) {
    return prisma.trainingEnrollment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completionDate: new Date(),
        score: score,
        certificateUrl: certificateUrl,
        progress: 100,
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
        },
        training: true
      }
    });
  },

  async cancelEnrollment(id: string) {
    return prisma.trainingEnrollment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
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
        },
        training: true
      }
    });
  },

  async getEnrollmentStats() {
    const totalEnrollments = await prisma.trainingEnrollment.count();
    const completedEnrollments = await prisma.trainingEnrollment.count({
      where: { status: 'COMPLETED' }
    });
    const inProgressEnrollments = await prisma.trainingEnrollment.count({
      where: { status: 'IN_PROGRESS' }
    });
    const plannedEnrollments = await prisma.trainingEnrollment.count({
      where: { status: 'PLANNED' }
    });

    return {
      total: totalEnrollments,
      completed: completedEnrollments,
      inProgress: inProgressEnrollments,
      planned: plannedEnrollments,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
    };
  },

  async getEnrollmentStatsByUser(userId: string) {
    const userEnrollments = await prisma.trainingEnrollment.findMany({
      where: { userId },
      include: {
        training: true
      }
    });

    const completed = userEnrollments.filter(e => e.status === 'COMPLETED').length;
    const inProgress = userEnrollments.filter(e => e.status === 'IN_PROGRESS').length;
    const planned = userEnrollments.filter(e => e.status === 'PLANNED').length;
    const total = userEnrollments.length;

    const averageScore = userEnrollments
      .filter(e => e.score !== null)
      .reduce((sum, e) => sum + (e.score || 0), 0) / 
      userEnrollments.filter(e => e.score !== null).length || 0;

    return {
      total,
      completed,
      inProgress,
      planned,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageScore
    };
  },

  async getEnrollmentStatsByTraining(trainingId: string) {
    const trainingEnrollments = await prisma.trainingEnrollment.findMany({
      where: { trainingId },
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
      }
    });

    const completed = trainingEnrollments.filter(e => e.status === 'COMPLETED').length;
    const inProgress = trainingEnrollments.filter(e => e.status === 'IN_PROGRESS').length;
    const planned = trainingEnrollments.filter(e => e.status === 'PLANNED').length;
    const total = trainingEnrollments.length;

    const averageScore = trainingEnrollments
      .filter(e => e.score !== null)
      .reduce((sum, e) => sum + (e.score || 0), 0) / 
      trainingEnrollments.filter(e => e.score !== null).length || 0;

    return {
      total,
      completed,
      inProgress,
      planned,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageScore,
      enrollments: trainingEnrollments
    };
  }
}; 