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
    const user = await prisma.applicationUser.findUnique({
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

    if (!user) return null;

    // Get user roles from UserRole table
    const userRoles = await this.getUserRoles(id);
    
    return {
      ...user,
      userRoles: userRoles
    };
  },

  async getByRole(role: string) {
    // Get users by role using the UserRole table
    const userRoles = await (prisma as any).userRole.findMany({
      where: {
        role: {
          name: role
        },
        isActive: true
      },
      include: {
        user: {
          include: {
            hardSkills: true,
            softSkills: true,
            experiences: true,
            cvData: true,
          }
        }
      }
    });
    
    // For each user, get their roles and add them to the user object
    const usersWithRoles = await Promise.all(
      userRoles.map(async (ur: any) => {
        const userRoles = await this.getUserRoles(ur.user.id);
        return {
          ...ur.user,
          userRoles: userRoles
        };
      })
    );
    
    return usersWithRoles;
  },

  async create(data: any) {
    // Adatta skills, experiences e cvData per il nested create Prisma
    const prismaData: any = { ...data };
    
    // Initialize with empty roles array - roles will be managed through UserRole table
    prismaData.roles = [];

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
    
    // Create the user first
    const createdUser = await prisma.applicationUser.create({ data: prismaData });
    
    // Handle role assignment if roles are provided
    if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
      try {
        // Get all available roles
        const allRoles = await (prisma as any).role.findMany();
        
        // Find roles that match the provided role names
        const rolesToAssign = allRoles.filter((role: any) => data.roles.includes(role.name));
        
        // Assign roles to the user
        for (const role of rolesToAssign) {
          await (prisma as any).userRole.create({
            data: {
              userId: createdUser.id,
              roleId: role.id,
              assignedBy: null, // System assignment
              isActive: true
            }
          });
        }
        
        console.log(`✅ Assigned ${rolesToAssign.length} roles to user ${createdUser.email}`);
      } catch (error) {
        console.error(`❌ Error assigning roles to user ${createdUser.email}:`, error);
        // Don't fail user creation if role assignment fails
      }
    }
    
    return createdUser;
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
      avatar: data.avatar, // Add avatar field mapping
    };

    // Roles are managed through the UserRole table, not the roles field
    // Remove roles from prismaData to prevent updates to the roles field
    delete prismaData.roles;

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
      const toDelete = currentIds.filter((idVal: string) => !incomingIds.includes(idVal));
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

    // --- LOGICA INTELLIGENTE ANCHE PER softSkills ---
    if (Array.isArray(data.softSkills)) {
      // 1. Recupera le softSkills attuali
      const current = await prisma.applicationUser.findUnique({
        where: { id },
        select: { softSkills: true }
      });
      const currentSkills = current?.softSkills || [];
      const currentIds = currentSkills.map((s: any) => s.id);
      const incoming = data.softSkills;
      const incomingIds = incoming.filter((s: any) => s.id).map((s: any) => s.id);

      // 2. Elimina quelle rimosse
      const toDelete = currentIds.filter((idVal: string) => !incomingIds.includes(idVal));
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
              applicationUserSoftId: id,
            };
          })
        });
      }
    }

    // --- LOGICA INTELLIGENTE ANCHE PER experiences ---
    if (Array.isArray(data.experiences)) {
      // 1. Recupera le experiences attuali
      const current = await prisma.applicationUser.findUnique({
        where: { id },
        select: { experiences: true }
      });
      const currentExperiences = current?.experiences || [];
      const currentIds = currentExperiences.map((e: any) => e.id);
      const incoming = data.experiences;
      const incomingIds = incoming.filter((e: any) => e.id).map((e: any) => e.id);

      // 2. Elimina quelle rimosse
      const toDelete = currentIds.filter((idVal: string) => !incomingIds.includes(idVal));
      if (toDelete.length > 0) {
        await prisma.experience.deleteMany({ where: { id: { in: toDelete } } });
      }
      // 3. Aggiorna quelle esistenti
      for (const exp of incoming as any[]) {
        if (exp.id && currentIds.includes(exp.id)) {
          await prisma.experience.update({
            where: { id: exp.id },
            data: {
              jobTitle: exp.jobTitle,
              companyName: exp.companyName,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              description: exp.description,
              technologiesUsed: Array.isArray(exp.technologiesUsed) ? exp.technologiesUsed : 
                               typeof exp.technologiesUsed === 'string' ? exp.technologiesUsed.split(',').map((s: string) => s.trim()) : [],
            }
          });
        }
      }
      // 4. Crea quelle nuove
      const toCreate = (incoming as any[]).filter((e: any) => !e.id);
      if (toCreate.length > 0) {
        await prisma.experience.createMany({
          data: toCreate.map((exp: any) => {
            const { id: _id, ...rest } = exp;
            return {
              ...rest,
              startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              technologiesUsed: Array.isArray(exp.technologiesUsed) ? exp.technologiesUsed : 
                               typeof exp.technologiesUsed === 'string' ? exp.technologiesUsed.split(',').map((s: string) => s.trim()) : [],
              applicationUserId: id,
            };
          })
        });
      }
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

  async updateRoles(id: string, roleNames: string[]) {
    // Remove all existing roles for the user
    await (prisma as any).userRole.deleteMany({
      where: { userId: id }
    });
    
    // Add new roles
    const allRoles = await (prisma as any).role.findMany();
    const rolesToAssign = allRoles.filter((role: any) => roleNames.includes(role.name));
    
    for (const role of rolesToAssign) {
      await (prisma as any).userRole.create({
        data: {
          userId: id,
          roleId: role.id,
          assignedBy: null,
          isActive: true
        }
      });
    }
    
    return this.getById(id);
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

  async getUserRoles(userId: string) {
    const userRoles = await (prisma as any).userRole.findMany({
      where: { 
        userId, 
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        role: true
      }
    });
    
    return userRoles.map((ur: any) => ur.role);
  },

  async getUserRolesWithPermissions(userId: string) {
    const userRoles = await (prisma as any).userRole.findMany({
      where: { userId, isActive: true },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });
    
    return userRoles.map((ur: any) => ({
      role: ur.role,
      permissions: ur.role.rolePermissions?.map((rp: any) => rp.permission) || []
    }));
  },
}; 