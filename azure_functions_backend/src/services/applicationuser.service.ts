import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RoleService } from './role.service';

const prisma = new PrismaClient();
const roleService = new RoleService();

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

  async getByRole(role: string, companyId?: string) {
    console.log(`🔍 getByRole called with role: ${role}, companyId: ${companyId || 'undefined'}`);
    
    // Build the where clause for UserRole
    const whereClause: any = {
      role: {
        name: role
      },
      isActive: true
    };

    // If companyId is provided, filter by company
    if (companyId) {
      whereClause.user = {
        company: companyId
      };
    }

    console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));

    // Get users by role using the UserRole table
    const userRoles = await (prisma as any).userRole.findMany({
      where: whereClause,
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
    
    console.log(`📋 Found ${userRoles.length} user roles for role: ${role}`);
    
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
    
    console.log(`✅ Returning ${usersWithRoles.length} users with roles`);
    return usersWithRoles;
  },

  async getNonSuperAdminUsers(companyId?: string) {
    console.log(`🔍 getNonSuperAdminUsers called with companyId: ${companyId || 'undefined'}`);
    
    // Build the where clause to exclude superadmin users
    const whereClause: any = {
      isActive: true,
      role: {
        name: {
          not: 'superadmin'
        }
      }
    };

    // If companyId is provided, filter by company
    if (companyId) {
      whereClause.user = {
        company: companyId
      };
    }

    // Get all users except superadmin using the UserRole table
    const userRoles = await (prisma as any).userRole.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            hardSkills: true,
            softSkills: true,
            experiences: true,
            cvData: true,
          }
        },
        role: true
      }
    });
    
    // Group by user and transform roles
    const userMap = new Map();
    
    for (const ur of userRoles) {
      if (!ur.user || !ur.role) continue;
      
      if (!userMap.has(ur.user.id)) {
        userMap.set(ur.user.id, {
          ...ur.user,
          userRoles: []
        });
      }
      
      userMap.get(ur.user.id).userRoles.push({
        id: ur.id,
        name: ur.role.name,
        description: ur.role.description,
        isActive: ur.isActive,
        createdAt: ur.role.createdAt,
        updatedAt: ur.role.updatedAt
      });
    }
    
    const usersWithRoles = Array.from(userMap.values());
    console.log(`✅ Returning ${usersWithRoles.length} non-superadmin users with roles`);
    return usersWithRoles;
  },

  async create(data: any, requestingUserId?: string) {
    // Adatta skills, experiences e cvData per il nested create Prisma
    const prismaData: any = { ...data };
    
    // Rimuovi il campo roles dai dati - verrà gestito separatamente tramite UserRole
    delete prismaData.roles;

    // Hash password if provided (passwordHash field contains the plain password from frontend)
    if (data.passwordHash) {
      prismaData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }

    // Genera un username unico se quello fornito è già in uso
    if (prismaData.username) {
      let finalUsername = prismaData.username;
      let counter = 1;
      
      while (true) {
        const existingUser = await prisma.applicationUser.findUnique({
          where: { username: finalUsername }
        });
        
        if (!existingUser) {
          break; // Username è disponibile
        }
        
        // Username già in uso, prova con un numero
        finalUsername = `${prismaData.username}${counter}`;
        counter++;
        
        // Limite di sicurezza per evitare loop infiniti
        if (counter > 100) {
          throw new Error('Impossibile generare un username unico dopo 100 tentativi');
        }
      }
      
      prismaData.username = finalUsername;
      console.log(`✅ Generated unique username: ${finalUsername}`);
    }

    // Il campo company viene ora gestito dal frontend
    // Se non viene fornito, rimane null
    if (prismaData.company) {
      console.log(`🏢 Company field provided from frontend: ${prismaData.company}`);
    } else {
      console.log(`⚠️ No company field provided, will be null`);
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
    
    // Create the user first
    const createdUser = await prisma.applicationUser.create({ data: prismaData });
    
    // Assegna i ruoli tramite il sistema UserRole
    if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
      try {
        const allRoles = await roleService.getAllRoles();
        
        for (const roleName of data.roles) {
          const role = allRoles.find(r => r.name === roleName);
          
          if (role) {
            await roleService.assignRoleToUser({
              userId: createdUser.id,
              roleId: role.id,
              assignedBy: requestingUserId || null
            });
            console.log(`✅ Role ${roleName} assigned to user ${createdUser.email}`);
          } else {
            console.warn(`⚠️ Role ${roleName} not found in database for user ${createdUser.email}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error assigning roles to user ${createdUser.email}:`, error);
        // Don't fail user creation if role assignment fails
      }
    } else {
      // Default to employee role if no roles provided
      try {
        const allRoles = await roleService.getAllRoles();
        const employeeRole = allRoles.find(role => role.name === 'employee');
        
        if (employeeRole) {
          await roleService.assignRoleToUser({
            userId: createdUser.id,
            roleId: employeeRole.id,
            assignedBy: requestingUserId || null
          });
          console.log(`✅ Default employee role assigned to user ${createdUser.email}`);
        } else {
          console.warn(`⚠️ Employee role not found in database for user ${createdUser.email}`);
        }
      } catch (error) {
        console.error(`❌ Error assigning default role to user ${createdUser.email}:`, error);
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



    // Password hash update (if provided)
    if (data.passwordHash) {
      prismaData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
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
    if (data.cvData) {
      const fileName = data.cvData.fileName || data.cvData.file_name;
      const storageUrl = data.cvData.storageUrl || data.cvData.storage_url;
      
      // If both fileName and storageUrl are empty or null, delete the CVData
      if ((!fileName || fileName.trim() === '') && (!storageUrl || storageUrl.trim() === '')) {
        // Delete existing CVData
        await prisma.cVData.deleteMany({ where: { applicationUserId: id } });
      } else if (fileName || storageUrl) {
        // Update or create CVData
        prismaData.cvData = {
          upsert: {
            update: {
              fileName: fileName,
              storageUrl: storageUrl,
            },
            create: {
              fileName: fileName,
              storageUrl: storageUrl,
              uploadDate: new Date(),
            },
          },
        };
      }
    }
    
    return prisma.applicationUser.update({ where: { id }, data: prismaData });
  },

  async remove(id: string) {
    try {
      // First, get the user data to collect all file references
      const user = await prisma.applicationUser.findUnique({
        where: { id },
        include: {
          cvData: true,
        }
      });

      if (!user) {
        throw new Error('User not found');
      }
      


      // Collect all files to delete
      const filesToDelete: string[] = [];

      // Add avatar file if exists
      if (user.avatar) {
        try {
          const avatarFileName = this.extractFileNameFromUrl(user.avatar);
          if (avatarFileName) {
            // Ensure avatar files have the correct prefix
            let finalAvatarFileName = avatarFileName;
            if (!avatarFileName.startsWith('avatars/') && !avatarFileName.startsWith('users/')) {
              if (avatarFileName.includes('/')) {
                finalAvatarFileName = avatarFileName;
              } else {
                finalAvatarFileName = `avatars/employees/${id}/${avatarFileName}`;
              }
            }
            filesToDelete.push(finalAvatarFileName);
          }
        } catch (error) {
          console.warn('Could not extract avatar filename:', error);
        }
      }
      
      // Also try to find avatar files using common avatar prefix patterns
      try {
        const { blobStorageService } = await import('./blobstorage.service');
        
        const avatarPrefixes = [
          `avatars/employees/${id}/`,
          `avatars/${id}/`,
          `users/${id}/avatars/`,
          `avatars/`,
          `users/${id}/`
        ];
        
        for (const avatarPrefix of avatarPrefixes) {
          const avatarFiles = await blobStorageService.listFiles(avatarPrefix);
          if (avatarFiles.length > 0) {
            const avatarFileNames = avatarFiles.map(blob => blob.name);
            for (const avatarFileName of avatarFileNames) {
              if (!filesToDelete.includes(avatarFileName)) {
                filesToDelete.push(avatarFileName);
              }
            }
          }
        }
      } catch (avatarError) {
        console.warn('Error accessing blob storage service for avatar files:', avatarError);
      }

      // Add CV file if exists
      if (user.cvData?.storageUrl) {
        try {
          const cvFileName = this.extractFileNameFromUrl(user.cvData.storageUrl);
          if (cvFileName) {
            // Ensure CV files have the correct prefix
            let finalCvFileName = cvFileName;
            if (!cvFileName.startsWith('cv/')) {
              finalCvFileName = `cv/${cvFileName}`;
            }
            filesToDelete.push(finalCvFileName);
          }
        } catch (error) {
          console.warn('Could not extract CV filename:', error);
        }
      }
      
      // Also try to find CV files using the CV prefix pattern
      try {
        const { blobStorageService } = await import('./blobstorage.service');
        const cvPrefix = `cv/${id}/`;
        const cvFiles = await blobStorageService.listFiles(cvPrefix);
        
        if (cvFiles.length > 0) {
          const cvFileNames = cvFiles.map(blob => blob.name);
          for (const cvFileName of cvFileNames) {
            if (!filesToDelete.includes(cvFileName)) {
              filesToDelete.push(cvFileName);
            }
          }
        }
      } catch (cvError) {
        console.warn('Error accessing blob storage service for CV files:', cvError);
      }

      // Delete all employee documents from blob storage
      try {
        // Import blob storage service dynamically to avoid circular dependencies
        const { blobStorageService } = await import('./blobstorage.service');
        
        // Get all employee documents using the employee documents prefix
        const employeeDocumentsPrefix = `employees/${id}/documents/`;
        const employeeDocuments = await blobStorageService.listFiles(employeeDocumentsPrefix);
        
        if (employeeDocuments.length > 0) {
          const documentFileNames = employeeDocuments.map(blob => blob.name);
          filesToDelete.push(...documentFileNames);
        }
      } catch (blobError) {
        console.warn('Error accessing blob storage service for employee documents:', blobError);
        // Continue with database deletion even if document deletion fails
      }

      // Delete all files from blob storage
      if (filesToDelete.length > 0) {
        try {
          const { blobStorageService } = await import('./blobstorage.service');
          
          // Delete files one by one, but don't fail if some don't exist
          for (const fileName of filesToDelete) {
            try {
              // Check if file exists before trying to delete
              const fileExists = await blobStorageService.fileExists(fileName);
              if (!fileExists) {
                // Try alternative paths for CV files
                if (fileName.includes('/') && !fileName.startsWith('cv/')) {
                  const alternativePath = `cv/${fileName}`;
                  const alternativeExists = await blobStorageService.fileExists(alternativePath);
                  if (alternativeExists) {
                    await blobStorageService.deleteFile(alternativePath);
                  }
                }
                
                // Try alternative paths for avatar files
                if (fileName.includes('/') && !fileName.startsWith('avatars/') && !fileName.startsWith('users/')) {
                  const avatarAlternativePaths = [
                    `avatars/employees/${fileName}`,
                    `avatars/${fileName}`,
                    `users/${fileName}`,
                    `avatars/employees/${fileName.split('/').pop()}`,
                    `avatars/${fileName.split('/').pop()}`,
                    `users/${fileName.split('/').pop()}`
                  ];
                  
                  for (const alternativePath of avatarAlternativePaths) {
                    const alternativeExists = await blobStorageService.fileExists(alternativePath);
                    if (alternativeExists) {
                      await blobStorageService.deleteFile(alternativePath);
                      break; // Stop after finding and deleting the first match
                    }
                  }
                }
                continue;
              }
              
              await blobStorageService.deleteFile(fileName);
            } catch (fileError) {
              console.warn(`Failed to delete file ${fileName}:`, fileError);
              
              // Try alternative paths for CV files if the original deletion failed
              if (fileName.includes('/') && !fileName.startsWith('cv/')) {
                try {
                  const alternativePath = `cv/${fileName}`;
                  const alternativeExists = await blobStorageService.fileExists(alternativePath);
                  if (alternativeExists) {
                    await blobStorageService.deleteFile(alternativePath);
                  }
                } catch (alternativeError) {
                  console.warn(`Also failed to delete alternative CV path:`, alternativeError);
                }
              }
              
              // Try alternative paths for avatar files if the original deletion failed
              if (fileName.includes('/') && !fileName.startsWith('avatars/') && !fileName.startsWith('users/')) {
                try {
                  const avatarAlternativePaths = [
                    `avatars/employees/${fileName}`,
                    `avatars/${fileName}`,
                    `users/${fileName}`,
                    `avatars/employees/${fileName.split('/').pop()}`,
                    `avatars/${fileName.split('/').pop()}`,
                    `users/${fileName.split('/').pop()}`
                  ];
                  
                  for (const alternativePath of avatarAlternativePaths) {
                    const alternativeExists = await blobStorageService.fileExists(alternativePath);
                    if (alternativeExists) {
                      await blobStorageService.deleteFile(alternativePath);
                      break; // Stop after finding and deleting the first match
                    }
                  }
                } catch (alternativeError) {
                  console.warn(`Also failed to delete alternative avatar path:`, alternativeError);
                }
              }
              
              // Continue with other files even if one fails
            }
          }
        } catch (blobError) {
          console.warn('Error accessing blob storage service:', blobError);
          // Continue with database deletion even if file deletion fails
        }
      }

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
      // Delete related UserRoles
      await (prisma as any).userRole.deleteMany({ where: { userId: id } });
      // Delete related UserActivityLogs
      await (prisma as any).userActivityLog.deleteMany({ where: { userId: id } });
      // Delete related Notifications (both sent and received)
      await (prisma as any).notification.deleteMany({ 
        where: { 
          OR: [
            { senderId: id },
            { recipientId: id }
          ]
        } 
      });
      // Delete related Assets
      await (prisma as any).asset.deleteMany({ where: { applicationUserId: id } });
      
      // Now delete the application user
      return prisma.applicationUser.delete({ where: { id } });
    } catch (error) {
      console.error('Error in user removal process:', error);
      throw error;
    }
  },

  /**
   * Extract filename from blob storage URL
   */
  extractFileNameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // For Azure Storage URLs like: http://127.0.0.1:10000/devstoreaccount1/skillup/path/to/file
      // pathname will be: /devstoreaccount1/skillup/path/to/file
      const parts = pathname.split('/').filter(part => part.length > 0);
      
      if (parts.length >= 3) {
        // Skip account name (devstoreaccount1) and container name (skillup)
        const fileName = parts.slice(2).join('/');
        // Decode URL-encoded characters
        return decodeURIComponent(fileName);
      }
      
      // Fallback: just the last part
      const fileName = parts[parts.length - 1] || '';
      return decodeURIComponent(fileName);
    } catch (error) {
      console.error('Error extracting filename from URL:', url, error);
      // Fallback: assume the filename is the last part of the URL
      const fileName = url.split('/').pop() || '';
      return decodeURIComponent(fileName);
    }
  },

  /**
   * Bulk remove multiple users and their associated files
   */
  async bulkRemove(userIds: string[]) {
    try {
      // Get all users with their file references
      const users = await prisma.applicationUser.findMany({
        where: { id: { in: userIds } },
        include: {
          cvData: true,
        }
      });
      


      // Collect all files to delete
      const filesToDelete: string[] = [];

      for (const user of users) {
        // Add avatar file if exists
        if (user.avatar) {
          try {
            const avatarFileName = this.extractFileNameFromUrl(user.avatar);
            if (avatarFileName) {
              // Ensure avatar files have the correct prefix
              let finalAvatarFileName = avatarFileName;
              if (!avatarFileName.startsWith('avatars/') && !avatarFileName.startsWith('users/')) {
                if (avatarFileName.includes('/')) {
                  finalAvatarFileName = avatarFileName;
                } else {
                  finalAvatarFileName = `avatars/employees/${user.id}/${avatarFileName}`;
                }
              }
              filesToDelete.push(finalAvatarFileName);
            }
          } catch (error) {
            console.warn(`Could not extract avatar filename for user ${user.id}:`, error);
          }
        }
        
        // Also try to find avatar files using common avatar prefix patterns for this user
        try {
          const { blobStorageService } = await import('./blobstorage.service');
          
          const avatarPrefixes = [
            `avatars/employees/${user.id}/`,
            `avatars/${user.id}/`,
            `users/${user.id}/avatars/`,
            `avatars/`,
            `users/${user.id}/`
          ];
          
          for (const avatarPrefix of avatarPrefixes) {
            const avatarFiles = await blobStorageService.listFiles(avatarPrefix);
            if (avatarFiles.length > 0) {
              const avatarFileNames = avatarFiles.map(blob => blob.name);
              for (const avatarFileName of avatarFileNames) {
                if (!filesToDelete.includes(avatarFileName)) {
                  filesToDelete.push(avatarFileName);
                }
              }
            }
          }
        } catch (avatarError) {
          console.warn(`Error accessing blob storage service for avatar files for user ${user.id}:`, avatarError);
        }

        // Add CV file if exists
        if (user.cvData?.storageUrl) {
          try {
            const cvFileName = this.extractFileNameFromUrl(user.cvData.storageUrl);
            if (cvFileName) {
              // Ensure CV files have the correct prefix
              let finalCvFileName = cvFileName;
              if (!cvFileName.startsWith('cv/')) {
                finalCvFileName = `cv/${cvFileName}`;
              }
              filesToDelete.push(finalCvFileName);
            }
          } catch (error) {
            console.warn(`Could not extract CV filename for user ${user.id}:`, error);
          }
        }
        
        // Also try to find CV files using the CV prefix pattern for this user
        try {
          const { blobStorageService } = await import('./blobstorage.service');
          const cvPrefix = `cv/${user.id}/`;
          const cvFiles = await blobStorageService.listFiles(cvPrefix);
          
          if (cvFiles.length > 0) {
            const cvFileNames = cvFiles.map(blob => blob.name);
            for (const cvFileName of cvFileNames) {
              if (!filesToDelete.includes(cvFileName)) {
                filesToDelete.push(cvFileName);
              }
            }
          }
        } catch (cvError) {
          console.warn(`Error accessing blob storage service for CV files for user ${user.id}:`, cvError);
        }
      }

      // Delete all employee documents from blob storage for all users
      try {
        const { blobStorageService } = await import('./blobstorage.service');
        
        for (const userId of userIds) {
          // Get all employee documents using the employee documents prefix
          const employeeDocumentsPrefix = `employees/${userId}/documents/`;
          const employeeDocuments = await blobStorageService.listFiles(employeeDocumentsPrefix);
          
          if (employeeDocuments.length > 0) {
            const documentFileNames = employeeDocuments.map(blob => blob.name);
            filesToDelete.push(...documentFileNames);
          }
        }
      } catch (blobError) {
        console.warn('Error accessing blob storage service for employee documents:', blobError);
        // Continue with database deletion even if document deletion fails
      }

      // Delete all files from blob storage in bulk
      if (filesToDelete.length > 0) {
        try {
          const { blobStorageService } = await import('./blobstorage.service');
          await blobStorageService.bulkDeleteFiles(filesToDelete);
        } catch (blobError) {
          console.warn('Error in bulk file deletion:', blobError);
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete all related data from database
      await prisma.experience.deleteMany({ where: { applicationUserId: { in: userIds } } });
      await prisma.employeeSkill.deleteMany({ where: { applicationUserHardId: { in: userIds } } });
      await prisma.employeeSkill.deleteMany({ where: { applicationUserSoftId: { in: userIds } } });
      await prisma.cVData.deleteMany({ where: { applicationUserId: { in: userIds } } });
      await prisma.projectAssignment.deleteMany({ where: { applicationUserId: { in: userIds } } });
      await (prisma as any).userRole.deleteMany({ where: { userId: { in: userIds } } });
      await (prisma as any).userActivityLog.deleteMany({ where: { userId: { in: userIds } } });
      await (prisma as any).notification.deleteMany({ 
        where: { 
          OR: [
            { senderId: { in: userIds } },
            { recipientId: { in: userIds } }
          ]
        } 
      });
      await (prisma as any).asset.deleteMany({ where: { applicationUserId: { in: userIds } } });
      
      // Finally delete the users
      const result = await prisma.applicationUser.deleteMany({ where: { id: { in: userIds } } });
      
      return {
        deletedUsers: result.count,
        deletedFiles: filesToDelete.length,
        totalUsers: userIds.length
      };
    } catch (error) {
      console.error('Error in bulk user removal process:', error);
      throw error;
    }
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