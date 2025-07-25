import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
  assignedBy: string | null;
  expiresAt?: Date;
}

export class RoleService {
  // Creare un nuovo ruolo
  async createRole(data: CreateRoleRequest): Promise<any> {
    return await (prisma as any).role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  // Ottenere tutti i ruoli
  async getAllRoles(): Promise<any[]> {
    return await (prisma as any).role.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // Ottenere un ruolo per ID
  async getRoleById(id: string): Promise<any | null> {
    return await (prisma as any).role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  // Aggiornare un ruolo
  async updateRole(id: string, data: UpdateRoleRequest): Promise<any> {
    return await (prisma as any).role.update({
      where: { id },
      data,
    });
  }

  // Eliminare un ruolo (soft delete)
  async deleteRole(id: string): Promise<any> {
    return await (prisma as any).role.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Assegnare un ruolo a un utente
  async assignRoleToUser(data: AssignRoleRequest): Promise<any> {
    return await (prisma as any).userRole.create({
      data: {
        userId: data.userId,
        roleId: data.roleId,
        assignedBy: data.assignedBy,
        expiresAt: data.expiresAt,
      },
      include: {
        role: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Rimuovere un ruolo da un utente
  async removeRoleFromUser(userId: string, roleId: string): Promise<any> {
    return await (prisma as any).userRole.update({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      data: { isActive: false },
    });
  }

  // Ottenere i ruoli di un utente
  async getUserRoles(userId: string): Promise<any[]> {
    return await (prisma as any).userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  // Ottenere solo i ruoli di un utente (senza i record UserRole)
  async getUserRolesOnly(userId: string): Promise<any[]> {
    const userRoles = await this.getUserRoles(userId);
    return userRoles.map(userRole => userRole.role);
  }

  // Ottenere tutti i permessi di un utente
  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.getUserRoles(userId);
    const permissions = new Set<string>();

    userRoles.forEach(userRole => {
      userRole.role.rolePermissions.forEach((rolePermission: any) => {
        if (rolePermission.isActive) {
          permissions.add(rolePermission.permission.name);
        }
      });
    });

    return Array.from(permissions);
  }

  // Verificare se un utente ha un permesso specifico
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.includes(permissionName);
  }

  // Verificare se un utente ha un ruolo specifico
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return userRoles.some(userRole => userRole.role.name === roleName);
  }
} 