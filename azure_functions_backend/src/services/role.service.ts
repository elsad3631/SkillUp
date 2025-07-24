import { PrismaClient, Role, UserRole, RolePermission } from '@prisma/client';

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
  assignedBy: string;
  expiresAt?: Date;
}

export class RoleService {
  // Creare un nuovo ruolo
  async createRole(data: CreateRoleRequest): Promise<Role> {
    return await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  // Ottenere tutti i ruoli
  async getAllRoles(): Promise<Role[]> {
    return await prisma.role.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // Ottenere un ruolo per ID
  async getRoleById(id: string): Promise<Role | null> {
    return await prisma.role.findUnique({
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
  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    return await prisma.role.update({
      where: { id },
      data,
    });
  }

  // Eliminare un ruolo (soft delete)
  async deleteRole(id: string): Promise<Role> {
    return await prisma.role.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Assegnare un ruolo a un utente
  async assignRoleToUser(data: AssignRoleRequest): Promise<UserRole> {
    return await prisma.userRole.create({
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
  async removeRoleFromUser(userId: string, roleId: string): Promise<UserRole> {
    return await prisma.userRole.update({
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
  async getUserRoles(userId: string): Promise<UserRole[]> {
    return await prisma.userRole.findMany({
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

  // Ottenere tutti i permessi di un utente
  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.getUserRoles(userId);
    const permissions = new Set<string>();

    userRoles.forEach(userRole => {
      userRole.role.rolePermissions.forEach(rolePermission => {
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