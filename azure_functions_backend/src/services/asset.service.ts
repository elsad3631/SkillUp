import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// TODO: Creare asset.controller.ts e asset.routes.ts per esporre le API degli asset
export const assetService = {
  async getAll(userId?: string) {
    if (userId) {
      return prisma.asset.findMany({
        where: { applicationUserId: userId },
        include: { applicationUser: true }
      });
    }
    return prisma.asset.findMany({
      include: { applicationUser: true }
    });
  },
  async getById(id: number) {
    return prisma.asset.findUnique({ 
      where: { id },
      include: { applicationUser: true }
    });
  },
  async create(data: any) {
    return prisma.asset.create({ 
      data,
      include: { applicationUser: true }
    });
  },
  async update(id: number, data: any) {
    return prisma.asset.update({ 
      where: { id }, 
      data,
      include: { applicationUser: true }
    });
  },
  async remove(id: number) {
    return prisma.asset.delete({ where: { id } });
  },
  async getByType(type: string, userId?: string) {
    const where: any = { type };
    if (userId) {
      where.applicationUserId = userId;
    }
    return prisma.asset.findMany({
      where,
      include: { applicationUser: true }
    });
  },
  async getByTypeAndCompany(type: string, company: string) {
    console.log("------------------------   " + type, company);
    return prisma.asset.findMany({
      where: {
        type,
        applicationUser: {
          company: company
        },
        enable: true
      },
      include: { applicationUser: true },
      orderBy: { name: 'asc' }
    });
  }
}; 