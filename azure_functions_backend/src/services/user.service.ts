import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userService = {
  async getAll() {
    return prisma.applicationUser.findMany();
  },
  async getById(id: string) {
    return prisma.applicationUser.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.applicationUser.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.applicationUser.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.applicationUser.delete({ where: { id } });
  },
}; 