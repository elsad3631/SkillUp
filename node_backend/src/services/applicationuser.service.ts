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
            project: true,
          },
        },
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
    // Mappa i dati da snake_case a camelCase
    const prismaData: any = {
      username: data.username,
      email: data.email,
      firstName: data.firstName || data.first_name,
      lastName: data.lastName || data.last_name,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth || data.date_of_birth,
      placeOfBirth: data.placeOfBirth || data.place_of_birth,
      address: data.address,
      currentRole: data.currentRole || data.current_role,
      department: data.department,
      isAvailable: data.isAvailable ?? data.is_available,
    };

    // Handle roles update
    if (data.roles) {
      if (typeof data.roles === 'string') {
        prismaData.roles = [data.roles];
      } else if (Array.isArray(data.roles)) {
        prismaData.roles = data.roles;
      }
    }

    // Password hash update (if provided)
    if (data.passwordHash) {
      prismaData.passwordHash = data.passwordHash;
    }

    // --- LOGICA INTELLIGENTE SOLO PER hardSkills ---
    if (Array.isArray(data.hardSkills)) {
      // 1. Recupera le hardSkills attuali
      const current = await prisma.applicationUser.findUnique({
        where: { id },
        select: { hardSkills: true }
      });
      const currentSkills = current?.hardSkills || [];
      const currentIds = currentSkills.map((s: any) => s.id);
      const incoming = data.hardSkills;
      const incomingIds = incoming.filter((s: any) => s.id).map((s: any) => s.id);

      // 2. Elimina quelle rimosse
      const toDelete = currentIds.filter(idVal => !incomingIds.includes(idVal));
      if (toDelete.length > 0) {
        await prisma.employeeSkill.deleteMany({ where: { id: { in: toDelete } } });
      }
      // 3. Aggiorna quelle esistenti
      for (const skill of incoming as any[]) {
        if (skill.id && currentIds.includes(skill.id)) {
          await prisma.employeeSkill.update({
            where: { id: skill.id },
            data: {
              name: skill.name,
              proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
              certification: skill.certification,
            }
          });
        }
      }
      // 4. Crea quelle nuove
      const toCreate = (incoming as any[]).filter((s: any) => !s.id);
      if (toCreate.length > 0) {
        await prisma.employeeSkill.createMany({
          data: toCreate.map((skill: any) => {
            const { id: _id, ...rest } = skill;
            return {
              ...rest,
              proficiencyLevel: skill.proficiencyLevel ? Number(skill.proficiencyLevel) : undefined,
              applicationUserHardId: id,
            };
          })
        });
      }
    }
    // --- FINE LOGICA INTELLIGENTE ---

    // Le altre relazioni restano come prima
    if (Array.isArray(data.softSkills) && data.softSkills.length > 0) {
      prismaData.softSkills = { create: data.softSkills };
    }
    if (Array.isArray(data.experiences) && data.experiences.length > 0) {
      prismaData.experiences = { create: data.experiences };
    }
    if (data.cvData && (data.cvData.fileName || data.cvData.storageUrl || data.cvData.file_name || data.cvData.storage_url)) {
      prismaData.cvData = {
        upsert: {
          update: {
            fileName: data.cvData.fileName || data.cvData.file_name,
            storageUrl: data.cvData.storageUrl || data.cvData.storage_url,
          },
          create: {
            fileName: data.cvData.fileName || data.cvData.file_name,
            storageUrl: data.cvData.storageUrl || data.cvData.storage_url,
            uploadDate: new Date(),
          },
        },
      };
    }
    
    return prisma.applicationUser.update({ where: { id }, data: prismaData });
  },

  async remove(id: string) {
    // Delete related experiences
    await prisma.experience.deleteMany({ where: { applicationUserId: id } });
    // Delete related hard skills
    await prisma.employeeSkill.deleteMany({ where: { applicationUserHardId: id } });
    // Delete related soft skills  
    await prisma.employeeSkill.deleteMany({ where: { applicationUserSoftId: id } });
    // Delete related CVData
    await prisma.cVData.deleteMany({ where: { applicationUserId: id } });
    // Delete related ProjectAssignments
    await prisma.projectAssignment.deleteMany({ where: { applicationUserId: id } });
    // Now delete the application user
    return prisma.applicationUser.delete({ where: { id } });
  },

  // Additional methods specific to ApplicationUser
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

  async updateRoles(id: string, roles: string[]) {
    return prisma.applicationUser.update({
      where: { id },
      data: { roles },
    });
  },

  async getAvailableUsers() {
    return prisma.applicationUser.findMany({
      where: { isAvailable: true },
      include: {
        hardSkills: true,
        softSkills: true,
        experiences: true,
        cvData: true,
      },
    });
  },
}; 