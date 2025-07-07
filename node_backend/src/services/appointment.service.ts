import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const appointmentService = {
  async getAll() {
    return prisma.projectAssignment.findMany();
  },
  async getById(id: string) {
    return prisma.projectAssignment.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.projectAssignment.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.projectAssignment.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.projectAssignment.delete({ where: { id } });
  },
}; 