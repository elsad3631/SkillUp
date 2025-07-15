import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applicationUserService = {
  async getAll() {
    return prisma.applicationUser.findMany({
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
      },
    });
  },

  async getById(id: string) {
    return prisma.applicationUser.findUnique({
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
      },
    });
  },

  async create(data: any) {
    // Adatta skills, experiences e cvData per il nested create Prisma
    const prismaData: any = { ...data };
    
    // Ensure roles is an array
    if (typeof data.roles === 'string') {
      prismaData.roles = [data.roles];
    } else if (!Array.isArray(data.roles)) {
      prismaData.roles = ['employee']; // Default role
    }

    if (Array.isArray(data.hardSkills) && data.hardSkills.length > 0) {
      prismaData.hardSkills = { create: data.hardSkills };
    }
    if (Array.isArray(data.softSkills) && data.softSkills.length > 0) {
      prismaData.softSkills = { create: data.softSkills };
    }
    if (Array.isArray(data.experiences) && data.experiences.length > 0) {
      prismaData.experiences = { create: data.experiences };
    }
    if (data.cvData && (data.cvData.fileName || data.cvData.storageUrl)) {
      prismaData.cvData = { create: { ...data.cvData, uploadDate: new Date() } };
    }
    
    return prisma.applicationUser.create({ data: prismaData });
  },

  async update(id: string, data: any) {
    const { hardSkills, softSkills, experiences, ...userData } = data;
    
    return await prisma.applicationUser.update({
      where: { id },
      data: {
        ...userData,
        ...(hardSkills && {
          hardSkills: {
            deleteMany: {},
            create: hardSkills
          }
        }),
        ...(softSkills && {
          softSkills: {
            deleteMany: {},
            create: softSkills
          }
        }),
        ...(experiences && {
          experiences: {
            deleteMany: {},
            create: experiences
          }
        })
      },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true
      }
    });
  },

  async remove(id: string) {
    return await prisma.applicationUser.delete({
      where: { id }
    });
  },

  async getByUsername(username: string) {
    return prisma.applicationUser.findUnique({
      where: { username },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
      },
    });
  },

  async getByEmail(email: string) {
    return prisma.applicationUser.findUnique({
      where: { email },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
      },
    });
  },

  async getByRole(role: string) {
    return prisma.applicationUser.findMany({
      where: {
        roles: {
          has: role,
        },
      },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
      },
    });
  },

  async updateRoles(id: string, roles: string[]) {
    return await prisma.applicationUser.update({
      where: { id },
      data: { roles },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true
      }
    });
  },

  async getAvailableUsers() {
    return await prisma.applicationUser.findMany({
      where: {
        isAvailable: true
      },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true
      }
    });
  }
}; 