import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const skillTrainingService = {
  async getAll() {
    return prisma.skillTraining.findMany();
  },
  async getById(id: string) {
    return prisma.skillTraining.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.skillTraining.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.skillTraining.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.skillTraining.delete({ where: { id } });
  },
}; 