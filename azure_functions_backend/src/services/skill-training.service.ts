import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const skillTrainingService = {
  async getAll() {
    return prisma.skillTraining.findMany({
      orderBy: {
        title: 'asc'
      }
    });
  },
  async getById(id: string) {
    return prisma.skillTraining.findUnique({ 
      where: { id },
      include: {
        enrollments: {
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
        }
      }
    });
  },
  async create(data: any) {
    return prisma.skillTraining.create({ 
      data,
      include: {
        enrollments: {
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
        }
      }
    });
  },
  async update(id: string, data: any) {
    return prisma.skillTraining.update({ 
      where: { id }, 
      data,
      include: {
        enrollments: {
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
        }
      }
    });
  },
  async remove(id: string) {
    return prisma.skillTraining.delete({ where: { id } });
  },
  async getByCompany(companyId: string) {
    return prisma.skillTraining.findMany({
      where: { company: companyId },
      orderBy: {
        title: 'asc'
      }
    });
  },
}; 