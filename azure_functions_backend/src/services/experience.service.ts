import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const experienceService = {
  async getAll() {
    return prisma.experience.findMany();
  },
  async getById(id: string) {
    return prisma.experience.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.experience.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.experience.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.experience.delete({ where: { id } });
  },
}; 