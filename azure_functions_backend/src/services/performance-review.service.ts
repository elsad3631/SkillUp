import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const performanceReviewService = {
  async getAll() {
    return prisma.performanceReview.findMany({
      include: {
        employee: {
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
        reviewer: {
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
        reviewDate: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.performanceReview.findUnique({
      where: { id },
      include: {
        employee: {
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
        reviewer: {
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

  async getByEmployeeId(employeeId: string) {
    return prisma.performanceReview.findMany({
      where: { employeeId },
      include: {
        reviewer: {
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
        reviewDate: 'desc'
      }
    });
  },

  async getByReviewerId(reviewerId: string) {
    return prisma.performanceReview.findMany({
      where: { reviewerId },
      include: {
        employee: {
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
        reviewDate: 'desc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.performanceReview.findMany({
      where: { status },
      include: {
        employee: {
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
        reviewer: {
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
        reviewDate: 'desc'
      }
    });
  },

  async getByReviewPeriod(reviewPeriod: string) {
    return prisma.performanceReview.findMany({
      where: { reviewPeriod },
      include: {
        employee: {
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
        reviewer: {
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
        reviewDate: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.performanceReview.create({
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        reviewPeriod: data.reviewPeriod,
        reviewDate: data.reviewDate || new Date(),
        overallScore: data.overallScore,
        technicalScore: data.technicalScore,
        softSkillScore: data.softSkillScore,
        leadershipScore: data.leadershipScore,
        feedback: data.feedback,
        strengths: data.strengths || [],
        areasForImprovement: data.areasForImprovement || [],
        goals: data.goals,
        status: data.status || 'DRAFT',
        nextReviewDate: data.nextReviewDate,
      },
      include: {
        employee: {
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
        reviewer: {
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
    return prisma.performanceReview.update({
      where: { id },
      data: {
        reviewPeriod: data.reviewPeriod,
        reviewDate: data.reviewDate,
        overallScore: data.overallScore,
        technicalScore: data.technicalScore,
        softSkillScore: data.softSkillScore,
        leadershipScore: data.leadershipScore,
        feedback: data.feedback,
        strengths: data.strengths,
        areasForImprovement: data.areasForImprovement,
        goals: data.goals,
        status: data.status,
        nextReviewDate: data.nextReviewDate,
      },
      include: {
        employee: {
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
        reviewer: {
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
    return prisma.performanceReview.delete({
      where: { id }
    });
  },

  async submitForApproval(id: string) {
    return prisma.performanceReview.update({
      where: { id },
      data: {
        status: 'SUBMITTED'
      },
      include: {
        employee: {
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
        reviewer: {
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

  async approve(id: string) {
    return prisma.performanceReview.update({
      where: { id },
      data: {
        status: 'APPROVED'
      },
      include: {
        employee: {
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
        reviewer: {
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

  async complete(id: string) {
    return prisma.performanceReview.update({
      where: { id },
      data: {
        status: 'COMPLETED'
      },
      include: {
        employee: {
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
        reviewer: {
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

  async getPendingReviews() {
    return prisma.performanceReview.findMany({
      where: {
        status: 'DRAFT'
      },
      include: {
        employee: {
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
        reviewer: {
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
        reviewDate: 'desc'
      }
    });
  },

  async getOverdueReviews() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return prisma.performanceReview.findMany({
      where: {
        reviewDate: {
          lt: thirtyDaysAgo
        },
        status: {
          in: ['DRAFT', 'SUBMITTED']
        }
      },
      include: {
        employee: {
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
        reviewer: {
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
        reviewDate: 'asc'
      }
    });
  },

  async getAverageScoresByEmployee(employeeId: string) {
    const reviews = await prisma.performanceReview.findMany({
      where: {
        employeeId,
        status: 'COMPLETED'
      },
      select: {
        overallScore: true,
        technicalScore: true,
        softSkillScore: true,
        leadershipScore: true,
        reviewDate: true
      },
      orderBy: {
        reviewDate: 'desc'
      }
    });

    if (reviews.length === 0) {
      return {
        averageOverallScore: 0,
        averageTechnicalScore: 0,
        averageSoftSkillScore: 0,
        averageLeadershipScore: 0,
        totalReviews: 0
      };
    }

    const totalOverall = reviews.reduce((sum, review) => sum + (review.overallScore || 0), 0);
    const totalTechnical = reviews.reduce((sum, review) => sum + (review.technicalScore || 0), 0);
    const totalSoftSkill = reviews.reduce((sum, review) => sum + (review.softSkillScore || 0), 0);
    const totalLeadership = reviews.reduce((sum, review) => sum + (review.leadershipScore || 0), 0);

    return {
      averageOverallScore: totalOverall / reviews.length,
      averageTechnicalScore: totalTechnical / reviews.length,
      averageSoftSkillScore: totalSoftSkill / reviews.length,
      averageLeadershipScore: totalLeadership / reviews.length,
      totalReviews: reviews.length
    };
  }
}; 