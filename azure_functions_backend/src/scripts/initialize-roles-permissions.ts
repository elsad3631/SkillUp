import { PrismaClient } from '@prisma/client';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';

const prisma = new PrismaClient();
const roleService = new RoleService();
const permissionService = new PermissionService();

async function initializeRolesAndPermissions() {
  try {
    console.log('🚀 Inizializzazione ruoli e permessi...');

    // 1. Creare permessi di default
    console.log('📝 Creazione permessi di default...');
    const permissions = await permissionService.createDefaultPermissions();
    console.log(`✅ Creati ${permissions.length} permessi di default`);

    // 2. Creare ruoli di default
    console.log('👥 Creazione ruoli di default...');
    
    const defaultRoles = [
      {
        name: 'superadmin',
        description: 'Super amministratore con tutti i permessi',
        permissions: [
          'users:create', 'users:read', 'users:update', 'users:delete',
          'projects:create', 'projects:read', 'projects:update', 'projects:delete',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete',
          'roles:create', 'roles:read', 'roles:update', 'roles:delete', 'roles:assign',
          'permissions:create', 'permissions:read', 'permissions:update', 'permissions:delete', 'permissions:grant',
          'dashboard:read', 'reports:read', 'reports:export',
          'activity:read', 'notifications:read', 'notifications:send'
        ]
      },
      {
        name: 'admin',
        description: 'Amministratore con permessi di gestione',
        permissions: [
          'users:create', 'users:read', 'users:update',
          'projects:create', 'projects:read', 'projects:update', 'projects:delete',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete',
          'roles:read', 'roles:assign',
          'permissions:read',
          'dashboard:read', 'reports:read', 'reports:export',
          'activity:read', 'notifications:read', 'notifications:send'
        ]
      },
      {
        name: 'manager',
        description: 'Manager di progetto',
        permissions: [
          'users:read',
          'projects:create', 'projects:read', 'projects:update',
          'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete',
          'dashboard:read', 'reports:read',
          'notifications:read', 'notifications:send'
        ]
      },
      {
        name: 'employee',
        description: 'Dipendente standard',
        permissions: [
          'users:read',
          'projects:read',
          'tasks:read', 'tasks:update',
          'dashboard:read',
          'notifications:read'
        ]
      },
      {
        name: 'viewer',
        description: 'Utente con permessi di sola lettura',
        permissions: [
          'users:read',
          'projects:read',
          'tasks:read',
          'dashboard:read',
          'notifications:read'
        ]
      }
    ];

    for (const roleData of defaultRoles) {
      let role;
      
      try {
        // Creare il ruolo o ottenerlo se esiste già
        role = await roleService.createRole({
          name: roleData.name,
          description: roleData.description
        });
        console.log(`✅ Creato ruolo: ${role.name}`);
      } catch (error) {
        // Se il ruolo esiste già, ottienilo
        const allRoles = await roleService.getAllRoles();
        role = allRoles.find((r: any) => r.name === roleData.name);
        if (role) {
          console.log(`⚠️ Ruolo ${roleData.name} già esistente, recuperato per assegnazione permessi`);
        } else {
          console.log(`❌ Errore nel recuperare il ruolo ${roleData.name}`);
          continue;
        }
      }

      // Assegnare i permessi al ruolo (sia nuovo che esistente)
      let assignedCount = 0;
      for (const permissionName of roleData.permissions) {
        try {
          // Usa il servizio invece di Prisma diretto
          const allPermissions = await permissionService.getAllPermissions();
          const permission = allPermissions.find((p: any) => p.name === permissionName);

          if (permission) {
            await permissionService.grantPermissionToRole({
              roleId: role.id,
              permissionId: permission.id,
              grantedBy: null // Use null for system assignment
            });
            assignedCount++;
          }
        } catch (error) {
          console.log(`⚠️ Permesso ${permissionName} non trovato o già assegnato`);
        }
      }
      console.log(`✅ Assegnati ${assignedCount} permessi al ruolo ${role.name}`);
    }

    // 3. Creare un utente superadmin di default se non esiste
    console.log('👤 Creazione utente superadmin di default...');
    const existingAdmin = await prisma.applicationUser.findFirst({
      where: { email: 'admin@skillup.com' }
    });

    if (!existingAdmin) {
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const adminUser = await prisma.applicationUser.create({
        data: {
          username: 'admin',
          email: 'admin@skillup.com',
          passwordHash,
          firstName: 'Super',
          lastName: 'Admin',
          isAvailable: true
        }
      });

      // Assegnare il ruolo superadmin
      const allRoles = await roleService.getAllRoles();
      const superadminRole = allRoles.find(r => r.name === 'superadmin');

      if (superadminRole) {
        await roleService.assignRoleToUser({
          userId: adminUser.id,
          roleId: superadminRole.id,
          assignedBy: null
        });
        console.log('✅ Creato utente superadmin: admin@skillup.com / admin123');
      }
    } else {
      console.log('⚠️ Utente admin già esistente');
    }

    console.log('🎉 Inizializzazione completata con successo!');
  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui lo script se chiamato direttamente
if (require.main === module) {
  initializeRolesAndPermissions();
}

export { initializeRolesAndPermissions }; 