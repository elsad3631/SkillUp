import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const skillRequirementService = {
  async getAll() {
    return prisma.skillRequirement.findMany();
  },
  async getById(id: string) {
    return prisma.skillRequirement.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.skillRequirement.create({ data });
  },
  async update(id: string, data: any) {
    return prisma.skillRequirement.update({
      where: { id },
      data: {
        name: data.name,
        minProficiencyLevel: Number(data.minProficiencyLevel || 1),
        isMandatory: data.isMandatory ?? false,
      },
    });
  },
  async remove(id: string) {
    return prisma.skillRequirement.delete({ where: { id } });
  },
}; 