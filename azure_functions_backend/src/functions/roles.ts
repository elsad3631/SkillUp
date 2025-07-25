import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { RoleService } from '../services/role.service';
import { verifyToken } from '../middlewares/auth';

const roleService = new RoleService();

// GET /api/roles - Ottieni tutti i ruoli
app.get('/api/roles', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:read');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const roles = await roleService.getAllRoles();
    return { status: 200, body: JSON.stringify(roles) };
  } catch (error) {
    context.error('Errore nel recupero dei ruoli:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
});

// GET /api/roles/:id - Ottieni ruolo per ID
app.get('/api/roles/{id}', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:read');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const id = request.params.id;
    const role = await roleService.getRoleById(id);
    
    if (!role) {
      return { status: 404, body: JSON.stringify({ error: 'Ruolo non trovato' }) };
    }

    return { status: 200, body: JSON.stringify(role) };
  } catch (error) {
    context.error('Errore nel recupero del ruolo:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
});

// POST /api/roles - Crea nuovo ruolo
app.post('/api/roles', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:create');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const body = await request.json() as { name: string; description?: string };
    const { name, description } = body;

    if (!name) {
      return { status: 400, body: JSON.stringify({ error: 'Nome del ruolo richiesto' }) };
    }

    const role = await roleService.createRole({ name, description });
    return { status: 201, body: JSON.stringify(role) };
  } catch (error) {
    context.error('Errore nella creazione del ruolo:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
});

// PUT /api/roles/:id - Aggiorna ruolo
app.put('/api/roles/{id}', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:update');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const id = request.params.id;
    const body = await request.json() as { name?: string; description?: string; isActive?: boolean };
    const { name, description, isActive } = body;

    const role = await roleService.updateRole(id, { name, description, isActive });
    return { status: 200, body: JSON.stringify(role) };
  } catch (error) {
    context.error('Errore nell\'aggiornamento del ruolo:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
});

// DELETE /api/roles/:id - Elimina ruolo
app.http('deleteRoleById', {
  methods: ['DELETE'],
  route: '/api/roles/{id}',
  authLevel: 'anonymous',
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
      const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:delete');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const id = request.params.id;
      const role = await roleService.deleteRole(id);
      return { status: 200, body: JSON.stringify(role) };
    } catch (error) {
      context.error('Errore nell\'eliminazione del ruolo:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// POST /api/roles/assign - Assegna ruolo a utente
app.post('/api/roles/assign', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:assign');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const body = await request.json() as { userId: string; roleId: string; expiresAt?: string };
    const { userId, roleId, expiresAt } = body;

    if (!userId || !roleId) {
      return { status: 400, body: JSON.stringify({ error: 'userId e roleId sono richiesti' }) };
    }

    const userRole = await roleService.assignRoleToUser({
      userId,
      roleId,
      assignedBy: decoded.userId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    return { status: 201, body: JSON.stringify(userRole) };
  } catch (error) {
    context.error('Errore nell\'assegnazione del ruolo:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
});

// DELETE /api/roles/assign/:userId/:roleId - Rimuovi ruolo da utente
app.http('removeRoleFromUser', {
  methods: ['DELETE'],
  route: '/api/roles/assign/{userId}/{roleId}',
  authLevel: 'anonymous',
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
      const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:assign');
      if (!hasPermission) {
        return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
      }

      const userId = request.params.userId;
      const roleId = request.params.roleId;

      const userRole = await roleService.removeRoleFromUser(userId, roleId);
      return { status: 200, body: JSON.stringify(userRole) };
    } catch (error) {
      context.error('Errore nella rimozione del ruolo:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// GET /api/users/:userId/roles - Ottieni ruoli di un utente
app.get('/api/users/{userId}/roles', async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
    const hasPermission = await roleService.hasPermission(decoded.userId, 'roles:read');
    if (!hasPermission) {
      return { status: 403, body: JSON.stringify({ error: 'Permesso negato' }) };
    }

    const userId = request.params.userId;
    const userRoles = await roleService.getUserRoles(userId);
    return { status: 200, body: JSON.stringify(userRoles) };
  } catch (error) {
    context.error('Errore nel recupero dei ruoli utente:', error);
    return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
  }
}); 