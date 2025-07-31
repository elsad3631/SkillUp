import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { PermissionService } from '../services/permission.service';
import { verifyToken } from '../middlewares/auth';

const permissionService = new PermissionService();

// GET /api/permissions - Ottieni tutti i permessi
app.http('permissions-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'permissions',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:read');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const permissions = await permissionService.getAllPermissions();
      return { status: 200, body: JSON.stringify(permissions) };
    } catch (error) {
      context.error('Errore nel recupero dei permessi:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// GET /api/permissions/:id - Ottieni permesso per ID
app.http('permissions-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'permissions/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:read');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const id = request.params.id;
      const permission = await permissionService.getPermissionById(id);
      
      if (!permission) {
        return { status: 404, body: JSON.stringify({ error: 'Permesso non trovato' }) };
      }

      return { status: 200, body: JSON.stringify(permission) };
    } catch (error) {
      context.error('Errore nel recupero del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// POST /api/permissions - Crea nuovo permesso
app.http('permissions-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'permissions',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:create');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const body = await request.json() as any;
      const { name, description, resource, action } = body;

      if (!name || !resource || !action) {
        return { status: 400, body: JSON.stringify({ error: 'Nome, risorsa e azione sono richiesti' }) };
      }

      const permission = await permissionService.createPermission({ name, description, resource, action });
      return { status: 201, body: JSON.stringify(permission) };
    } catch (error) {
      context.error('Errore nella creazione del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// PUT /api/permissions/:id - Aggiorna permesso
app.http('permissions-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'permissions/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:update');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const id = request.params.id;
      const body = await request.json() as any;
      const { name, description, resource, action } = body;

      if (!name || !resource || !action) {
        return { status: 400, body: JSON.stringify({ error: 'Nome, risorsa e azione sono richiesti' }) };
      }

      const permission = await permissionService.updatePermission(id, { name, description, resource, action });
      
      if (!permission) {
        return { status: 404, body: JSON.stringify({ error: 'Permesso non trovato' }) };
      }

      return { status: 200, body: JSON.stringify(permission) };
    } catch (error) {
      context.error('Errore nell\'aggiornamento del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// DELETE /api/permissions/:id - Elimina permesso
app.http('permissions-delete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'permissions/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:delete');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const id = request.params.id;
      await permissionService.deletePermission(id);
      return { status: 204 };
    } catch (error) {
      context.error('Errore nell\'eliminazione del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// POST /api/permissions/grant/:roleId/:permissionId - Concedi permesso a ruolo
app.http('grantPermissionToRole', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'permissions/grant/{roleId}/{permissionId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:grant');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const roleId = request.params.roleId;
      const permissionId = request.params.permissionId;

      const rolePermission = await permissionService.grantPermissionToRole({
        roleId,
        permissionId,
        grantedBy: decoded.userId
      });
      return { status: 201, body: JSON.stringify(rolePermission) };
    } catch (error) {
      context.error('Errore nella concessione del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// DELETE /api/permissions/grant/:roleId/:permissionId - Revoca permesso da ruolo
app.http('revokePermissionFromRole', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'permissions/grant/{roleId}/{permissionId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:grant');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const roleId = request.params.roleId;
      const permissionId = request.params.permissionId;

      const rolePermission = await permissionService.revokePermissionFromRole(roleId, permissionId);
      return { status: 200, body: JSON.stringify(rolePermission) };
    } catch (error) {
      context.error('Errore nella revoca del permesso:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// GET /api/roles/:roleId/permissions - Ottieni permessi di un ruolo
app.http('getRolePermissions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'roles/{roleId}/permissions',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:read');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const roleId = request.params.roleId;
      const rolePermissions = await permissionService.getRolePermissions(roleId);
      return { status: 200, body: JSON.stringify(rolePermissions) };
    } catch (error) {
      context.error('Errore nel recupero dei permessi del ruolo:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// POST /api/permissions/initialize - Inizializza permessi di default
app.http('initializePermissions', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'permissions/initialize',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return { status: 401, body: JSON.stringify({ error: 'Token non fornito' }) };
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return { status: 401, body: JSON.stringify({ error: 'Token non valido' }) };
      }

      // Verifica permesso
      const roleService = new (await import('../services/role.service')).RoleService();
      const hasPermission = await roleService.hasPermission(decoded.userId, 'permissions:create');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const permissions = await permissionService.createDefaultPermissions();
      return { status: 201, body: JSON.stringify({ message: 'Permessi di default creati', count: permissions.length }) };
    } catch (error) {
      context.error('Errore nell\'inizializzazione dei permessi:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
}); 