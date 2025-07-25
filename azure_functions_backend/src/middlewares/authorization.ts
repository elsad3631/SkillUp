import { HttpRequest, HttpResponseInit } from '@azure/functions';
import { verifyToken, DecodedToken } from './auth';

export interface AuthorizationOptions {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  allowOwnResource?: boolean; // Permette accesso se l'utente accede alle proprie risorse
  resourceOwnerField?: string; // Campo per identificare il proprietario della risorsa
}

export function requireAuth(options: AuthorizationOptions = {}) {
  return async (request: HttpRequest): Promise<{ user: DecodedToken; isAuthorized: boolean; error?: string }> => {
    try {
      // Verifica token
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { user: null as any, isAuthorized: false, error: 'Token non fornito' };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { user: null as any, isAuthorized: false, error: 'Token non valido' };
      }

      // Se non ci sono requisiti specifici, l'utente è autorizzato
      if (!options.requiredPermissions && !options.requiredRoles) {
        return { user: decoded, isAuthorized: true };
      }

      // Verifica ruoli richiesti
      if (options.requiredRoles && options.requiredRoles.length > 0) {
        const hasRequiredRole = options.requiredRoles.some(role => 
          decoded.roles.includes(role)
        );
        if (!hasRequiredRole) {
          return { user: decoded, isAuthorized: false, error: 'Ruolo non autorizzato' };
        }
      }

      // Verifica permessi richiesti
      if (options.requiredPermissions && options.requiredPermissions.length > 0) {
        const userPermissions = decoded.permissions || [];
        const hasRequiredPermission = options.requiredPermissions.some(permission => 
          userPermissions.includes(permission)
        );
        if (!hasRequiredPermission) {
          return { user: decoded, isAuthorized: false, error: 'Permesso non autorizzato' };
        }
      }

      // Verifica accesso alle proprie risorse
      if (options.allowOwnResource && options.resourceOwnerField) {
        const body = await request.json().catch(() => ({}));
        const resourceOwnerId = (body as any)[options.resourceOwnerField];
        
        if (resourceOwnerId && resourceOwnerId === decoded.userId) {
          return { user: decoded, isAuthorized: true };
        }
      }

      return { user: decoded, isAuthorized: true };
    } catch (error) {
      console.error('Errore nell\'autorizzazione:', error);
      return { user: null as any, isAuthorized: false, error: 'Errore nell\'autorizzazione' };
    }
  };
}

// Helper functions per permessi comuni
export const requireUserPermission = requireAuth({ requiredPermissions: ['users:read'] });
export const requireUserCreatePermission = requireAuth({ requiredPermissions: ['users:create'] });
export const requireUserUpdatePermission = requireAuth({ requiredPermissions: ['users:update'] });
export const requireUserDeletePermission = requireAuth({ requiredPermissions: ['users:delete'] });

export const requireProjectPermission = requireAuth({ requiredPermissions: ['projects:read'] });
export const requireProjectCreatePermission = requireAuth({ requiredPermissions: ['projects:create'] });
export const requireProjectUpdatePermission = requireAuth({ requiredPermissions: ['projects:update'] });
export const requireProjectDeletePermission = requireAuth({ requiredPermissions: ['projects:delete'] });

export const requireTaskPermission = requireAuth({ requiredPermissions: ['tasks:read'] });
export const requireTaskCreatePermission = requireAuth({ requiredPermissions: ['tasks:create'] });
export const requireTaskUpdatePermission = requireAuth({ requiredPermissions: ['tasks:update'] });
export const requireTaskDeletePermission = requireAuth({ requiredPermissions: ['tasks:delete'] });

export const requireRolePermission = requireAuth({ requiredPermissions: ['roles:read'] });
export const requireRoleCreatePermission = requireAuth({ requiredPermissions: ['roles:create'] });
export const requireRoleUpdatePermission = requireAuth({ requiredPermissions: ['roles:update'] });
export const requireRoleDeletePermission = requireAuth({ requiredPermissions: ['roles:delete'] });
export const requireRoleAssignPermission = requireAuth({ requiredPermissions: ['roles:assign'] });

export const requirePermissionRead = requireAuth({ requiredPermissions: ['permissions:read'] });
export const requirePermissionCreate = requireAuth({ requiredPermissions: ['permissions:create'] });
export const requirePermissionUpdate = requireAuth({ requiredPermissions: ['permissions:update'] });
export const requirePermissionDelete = requireAuth({ requiredPermissions: ['permissions:delete'] });
export const requirePermissionGrant = requireAuth({ requiredPermissions: ['permissions:grant'] });

export const requireDashboardPermission = requireAuth({ requiredPermissions: ['dashboard:read'] });
export const requireReportPermission = requireAuth({ requiredPermissions: ['reports:read'] });
export const requireReportExportPermission = requireAuth({ requiredPermissions: ['reports:export'] });

export const requireActivityPermission = requireAuth({ requiredPermissions: ['activity:read'] });
export const requireNotificationRead = requireAuth({ requiredPermissions: ['notifications:read'] });
export const requireNotificationSend = requireAuth({ requiredPermissions: ['notifications:send'] });

// Helper per verificare se l'utente è admin
export function isAdmin(roles: string[]): boolean {
  return roles.includes('admin') || roles.includes('superadmin');
}

// Helper per verificare se l'utente ha un permesso specifico
export function hasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission);
}

// Helper per verificare se l'utente ha uno dei permessi richiesti
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  return permissions.some(permission => userPermissions.includes(permission));
}

// Helper per verificare se l'utente ha tutti i permessi richiesti
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
  return permissions.every(permission => userPermissions.includes(permission));
} 