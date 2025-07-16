import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// TODO: Creare asset.controller.ts e asset.routes.ts per esporre le API degli asset
export const assetService = {
  async getAll() {
    return prisma.asset.findMany();
  },
  async getById(id: number) {
    return prisma.asset.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.asset.create({ data });
  },
  async update(id: number, data: any) {
    return prisma.asset.update({ where: { id }, data });
  },
  async remove(id: number) {
    return prisma.asset.delete({ where: { id } });
  },
}; 