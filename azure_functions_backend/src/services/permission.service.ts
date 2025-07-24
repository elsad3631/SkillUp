import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePermissionRequest {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
  isActive?: boolean;
}

export interface GrantPermissionRequest {
  roleId: string;
  permissionId: string;
  grantedBy: string;
}

export class PermissionService {
  // Creare un nuovo permesso
  async createPermission(data: CreatePermissionRequest) {
    return await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
      },
    });
  }

  // Ottenere tutti i permessi
  async getAllPermissions() {
    return await prisma.permission.findMany({
      where: { isActive: true },
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  // Ottenere un permesso per ID
  async getPermissionById(id: string) {
    return await prisma.permission.findUnique({
      where: { id },
    });
  }

  // Ottenere permessi per risorsa
  async getPermissionsByResource(resource: string) {
    return await prisma.permission.findMany({
      where: {
        resource,
        isActive: true,
      },
      orderBy: { action: 'asc' },
    });
  }

  // Aggiornare un permesso
  async updatePermission(id: string, data: UpdatePermissionRequest) {
    return await prisma.permission.update({
      where: { id },
      data,
    });
  }

  // Eliminare un permesso (soft delete)
  async deletePermission(id: string) {
    return await prisma.permission.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Concedere un permesso a un ruolo
  async grantPermissionToRole(data: GrantPermissionRequest) {
    return await prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
        grantedBy: data.grantedBy,
      },
      include: {
        role: true,
        permission: true,
      },
    });
  }

  // Revocare un permesso da un ruolo
  async revokePermissionFromRole(roleId: string, permissionId: string) {
    return await prisma.rolePermission.update({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      data: { isActive: false },
    });
  }

  // Ottenere i permessi di un ruolo
  async getRolePermissions(roleId: string) {
    return await prisma.rolePermission.findMany({
      where: {
        roleId,
        isActive: true,
      },
      include: {
        permission: true,
      },
    });
  }

  // Creare permessi di default per il sistema
  async createDefaultPermissions() {
    const defaultPermissions = [
      // Permessi per utenti
      { name: 'users:create', description: 'Creare nuovi utenti', resource: 'users', action: 'create' },
      { name: 'users:read', description: 'Visualizzare utenti', resource: 'users', action: 'read' },
      { name: 'users:update', description: 'Modificare utenti', resource: 'users', action: 'update' },
      { name: 'users:delete', description: 'Eliminare utenti', resource: 'users', action: 'delete' },
      
      // Permessi per progetti
      { name: 'projects:create', description: 'Creare nuovi progetti', resource: 'projects', action: 'create' },
      { name: 'projects:read', description: 'Visualizzare progetti', resource: 'projects', action: 'read' },
      { name: 'projects:update', description: 'Modificare progetti', resource: 'projects', action: 'update' },
      { name: 'projects:delete', description: 'Eliminare progetti', resource: 'projects', action: 'delete' },
      
      // Permessi per task
      { name: 'tasks:create', description: 'Creare nuovi task', resource: 'tasks', action: 'create' },
      { name: 'tasks:read', description: 'Visualizzare task', resource: 'tasks', action: 'read' },
      { name: 'tasks:update', description: 'Modificare task', resource: 'tasks', action: 'update' },
      { name: 'tasks:delete', description: 'Eliminare task', resource: 'tasks', action: 'delete' },
      
      // Permessi per ruoli e permessi
      { name: 'roles:create', description: 'Creare nuovi ruoli', resource: 'roles', action: 'create' },
      { name: 'roles:read', description: 'Visualizzare ruoli', resource: 'roles', action: 'read' },
      { name: 'roles:update', description: 'Modificare ruoli', resource: 'roles', action: 'update' },
      { name: 'roles:delete', description: 'Eliminare ruoli', resource: 'roles', action: 'delete' },
      { name: 'roles:assign', description: 'Assegnare ruoli', resource: 'roles', action: 'assign' },
      
      // Permessi per permessi
      { name: 'permissions:create', description: 'Creare nuovi permessi', resource: 'permissions', action: 'create' },
      { name: 'permissions:read', description: 'Visualizzare permessi', resource: 'permissions', action: 'read' },
      { name: 'permissions:update', description: 'Modificare permessi', resource: 'permissions', action: 'update' },
      { name: 'permissions:delete', description: 'Eliminare permessi', resource: 'permissions', action: 'delete' },
      { name: 'permissions:grant', description: 'Concedere permessi', resource: 'permissions', action: 'grant' },
      
      // Permessi per dashboard e report
      { name: 'dashboard:read', description: 'Visualizzare dashboard', resource: 'dashboard', action: 'read' },
      { name: 'reports:read', description: 'Visualizzare report', resource: 'reports', action: 'read' },
      { name: 'reports:export', description: 'Esportare report', resource: 'reports', action: 'export' },
      
      // Permessi per attività e log
      { name: 'activity:read', description: 'Visualizzare log attività', resource: 'activity', action: 'read' },
      { name: 'notifications:read', description: 'Visualizzare notifiche', resource: 'notifications', action: 'read' },
      { name: 'notifications:send', description: 'Inviare notifiche', resource: 'notifications', action: 'send' },
    ];

    const createdPermissions = [];
    for (const permission of defaultPermissions) {
      try {
        const created = await this.createPermission(permission);
        createdPermissions.push(created);
      } catch (error) {
        // Se il permesso esiste già, lo saltiamo
        console.log(`Permission ${permission.name} already exists`);
      }
    }

    return createdPermissions;
  }
} 