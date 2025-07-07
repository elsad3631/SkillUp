import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const skillService = {
  async getAll() {
    return prisma.employeeSkill.findMany();
  },
  async getById(id: string) {
    return prisma.employeeSkill.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.employeeSkill.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.employeeSkill.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.employeeSkill.delete({ where: { id } });
  },
}; 