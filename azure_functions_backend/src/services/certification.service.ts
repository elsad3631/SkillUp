import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const certificationService = {
  async getAll() {
    return prisma.certification.findMany({
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
        issueDate: 'desc'
      }
    });
  },

  async getById(id: string) {
    return prisma.certification.findUnique({
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
    return prisma.certification.findMany({
      where: { userId },
      orderBy: {
        issueDate: 'desc'
      }
    });
  },

  async getByStatus(status: string) {
    return prisma.certification.findMany({
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
        }
      },
      orderBy: {
        issueDate: 'desc'
      }
    });
  },

  async getActiveCertifications() {
    return prisma.certification.findMany({
      where: { status: 'ACTIVE' },
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
        issueDate: 'desc'
      }
    });
  },

  async getExpiredCertifications() {
    const today = new Date();
    return prisma.certification.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: {
          lt: today
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
        expiryDate: 'asc'
      }
    });
  },

  async getExpiringSoon(daysThreshold: number = 30) {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return prisma.certification.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: {
          gte: today,
          lte: thresholdDate
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
        expiryDate: 'asc'
      }
    });
  },

  async getByIssuingAuthority(authority: string) {
    return prisma.certification.findMany({
      where: { issuingAuthority: authority },
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
        issueDate: 'desc'
      }
    });
  },

  async create(data: any) {
    return prisma.certification.create({
      data: {
        userId: data.userId,
        name: data.name,
        issuingAuthority: data.issuingAuthority,
        certificateNumber: data.certificateNumber,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        status: data.status || 'ACTIVE',
        credentialUrl: data.credentialUrl,
        description: data.description,
        tags: data.tags || [],
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

  async update(id: string, data: any) {
    return prisma.certification.update({
      where: { id },
      data: {
        name: data.name,
        issuingAuthority: data.issuingAuthority,
        certificateNumber: data.certificateNumber,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        status: data.status,
        credentialUrl: data.credentialUrl,
        description: data.description,
        tags: data.tags,
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
    return prisma.certification.delete({
      where: { id }
    });
  },

  async revoke(id: string) {
    return prisma.certification.update({
      where: { id },
      data: {
        status: 'REVOKED'
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

  async renew(id: string, newExpiryDate: Date) {
    return prisma.certification.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        expiryDate: newExpiryDate
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

  async getCertificationStats() {
    const totalCertifications = await prisma.certification.count();
    const activeCertifications = await prisma.certification.count({
      where: { status: 'ACTIVE' }
    });
    const expiredCertifications = await prisma.certification.count({
      where: { status: 'EXPIRED' }
    });
    const revokedCertifications = await prisma.certification.count({
      where: { status: 'REVOKED' }
    });

    return {
      total: totalCertifications,
      active: activeCertifications,
      expired: expiredCertifications,
      revoked: revokedCertifications,
      activeRate: totalCertifications > 0 ? (activeCertifications / totalCertifications) * 100 : 0
    };
  },

  async getCertificationStatsByUser(userId: string) {
    const userCertifications = await prisma.certification.findMany({
      where: { userId }
    });

    const active = userCertifications.filter(c => c.status === 'ACTIVE').length;
    const expired = userCertifications.filter(c => c.status === 'EXPIRED').length;
    const revoked = userCertifications.filter(c => c.status === 'REVOKED').length;
    const total = userCertifications.length;

    return {
      total,
      active,
      expired,
      revoked,
      activeRate: total > 0 ? (active / total) * 100 : 0
    };
  },

  async getCertificationStatsByAuthority(authority: string) {
    const authorityCertifications = await prisma.certification.findMany({
      where: { issuingAuthority: authority }
    });

    const active = authorityCertifications.filter(c => c.status === 'ACTIVE').length;
    const expired = authorityCertifications.filter(c => c.status === 'EXPIRED').length;
    const revoked = authorityCertifications.filter(c => c.status === 'REVOKED').length;
    const total = authorityCertifications.length;

    return {
      total,
      active,
      expired,
      revoked,
      activeRate: total > 0 ? (active / total) * 100 : 0
    };
  },

  async searchCertifications(searchTerm: string) {
    return prisma.certification.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { issuingAuthority: { contains: searchTerm, mode: 'insensitive' } },
          { certificateNumber: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
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
        issueDate: 'desc'
      }
    });
  }
}; 