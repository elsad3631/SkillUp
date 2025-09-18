import { PrismaClient } from '@prisma/client';
import { RoleService } from './role.service';

const prisma = new PrismaClient();
const roleService = new RoleService();

export const userService = {
  async getAll() {
    return prisma.applicationUser.findMany();
  },
  async getById(id: string) {
    return prisma.applicationUser.findUnique({ where: { id } });
  },
  async create(data: any, requestingUserId?: string) {
    // Rimuovi il campo roles dai dati - verrà gestito separatamente tramite UserRole
    const { roles, ...userData } = data;
    
    // Il campo company viene ora gestito dal frontend
    // Se non viene fornito, rimane null

    // Genera un username unico se quello fornito è già in uso
    if (userData.username) {
      let finalUsername = userData.username;
      let counter = 1;
      
      while (true) {
        const existingUser = await prisma.applicationUser.findUnique({
          where: { username: finalUsername }
        });
        
        if (!existingUser) {
          break; // Username è disponibile
        }
        
        // Username già in uso, prova con un numero
        finalUsername = `${userData.username}${counter}`;
        counter++;
        
        // Limite di sicurezza per evitare loop infiniti
        if (counter > 100) {
          throw new Error('Impossibile generare un username unico dopo 100 tentativi');
        }
      }
      
      userData.username = finalUsername;
    }

    // Create the user first
    const createdUser = await prisma.applicationUser.create({ data: userData });
    
    // Assegna i ruoli tramite il sistema UserRole
    if (roles && Array.isArray(roles) && roles.length > 0) {
      try {
        const allRoles = await roleService.getAllRoles();
        
        for (const roleName of roles) {
          const role = allRoles.find(r => r.name === roleName);
          
          if (role) {
            await roleService.assignRoleToUser({
              userId: createdUser.id,
              roleId: role.id,
              assignedBy: requestingUserId || null
            });
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
    return prisma.applicationUser.update({ where: { id }, data });
  },
  async remove(id: string) {
    // Use the comprehensive removal logic from applicationUserService
    const { applicationUserService } = await import('./applicationuser.service');
    return applicationUserService.remove(id);
  },
}; 