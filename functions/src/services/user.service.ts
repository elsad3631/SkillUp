import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  async createUser(data: any) {
    return await prisma.applicationUser.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
      }
    });
  },

  async getAllUsers() {
    return await prisma.applicationUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        currentRole: true,
        department: true,
        isAvailable: true,
        roles: true
      },
      orderBy: { firstName: 'asc' }
    });
  },

  async getUserById(id: string) {
    const user = await prisma.applicationUser.findUnique({
      where: { id },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
        projectAssignments: {
          include: {
            project: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async updateUser(id: string, data: any) {
    return await prisma.applicationUser.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
      }
    });
  },

  async deleteUser(id: string) {
    return await prisma.applicationUser.delete({
      where: { id }
    });
  }
}; 