import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cvDataService = {
  async getAll() {
    return prisma.cVData.findMany();
  },
  async getById(id: string) {
    return prisma.cVData.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.cVData.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.cVData.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.cVData.delete({ where: { id } });
  },
}; 