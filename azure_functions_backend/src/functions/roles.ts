import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { RoleService } from '../services/role.service';

const roleService = new RoleService();

// Register the routes
app.http('getAllRoles', {
  methods: ['GET'],
  route: 'roles',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const roles = await roleService.getAllRoles();
      return { status: 200, body: JSON.stringify(roles) };
    } catch (error) {
      context.error('Errore nel recupero dei ruoli:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// GET /api/roles/:id - Ottieni ruolo per ID
app.http('getRoleById', {
  methods: ['GET'],
  route: 'roles/{id}',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
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
  }
});

// POST /api/roles - Crea nuovo ruolo
app.http('createRole', {
  methods: ['POST'],
  route: 'roles',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
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
  }
});

// PUT /api/roles/:id - Aggiorna ruolo
app.http('updateRole', {
  methods: ['PUT'],
  route: 'roles/{id}',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      const body = await request.json() as { name?: string; description?: string; isActive?: boolean };
      const { name, description, isActive } = body;

      const role = await roleService.updateRole(id, { name, description, isActive });
      return { status: 200, body: JSON.stringify(role) };
    } catch (error) {
      context.error('Errore nell\'aggiornamento del ruolo:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// DELETE /api/roles/:id - Elimina ruolo
app.http('deleteRoleById', {
  methods: ['DELETE'],
  route: 'roles/{id}',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
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
app.http('assignRoleToUser', {
  methods: ['POST'],
  route: 'roles/assign',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as { userId: string; roleId: string; expiresAt?: string };
      const { userId, roleId, expiresAt } = body;

      if (!userId || !roleId) {
        return { status: 400, body: JSON.stringify({ error: 'userId e roleId sono richiesti' }) };
      }

      const userRole = await roleService.assignRoleToUser({
        userId,
        roleId,
        assignedBy: null, // Temporaneamente null per il debug
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });

      return { status: 201, body: JSON.stringify(userRole) };
    } catch (error) {
      context.error('Errore nell\'assegnazione del ruolo:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// DELETE /api/roles/assign/:userId/:roleId - Rimuovi ruolo da utente
app.http('removeRoleFromUser', {
  methods: ['DELETE'],
  route: 'roles/assign/{userId}/{roleId}',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
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
app.http('getUserRoles', {
  methods: ['GET'],
  route: 'users/{userId}/roles',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const userId = request.params.userId;
      console.log('Getting roles for user:', userId);
      
      const userRoles = await roleService.getUserRolesOnly(userId);
      console.log('User roles found:', userRoles);
      
      return { status: 200, body: JSON.stringify(userRoles) };
    } catch (error) {
      context.error('Errore nel recupero dei ruoli utente:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// Register the routes
app.http('getAvailableRoles', {
  methods: ['GET'],
  route: 'roles/available',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const roles = await roleService.getAllRoles();
      return { status: 200, body: JSON.stringify(roles) };
    } catch (error) {
      context.error('Errore nel recupero dei ruoli disponibili:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// Debug endpoint to check user roles
app.http('debugUserRoles', {
  methods: ['GET'],
  route: 'debug/user-roles',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Get all users with their roles
      const usersWithRoles = await prisma.applicationUser.findMany({
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });
      
      const result = usersWithRoles.map((user: any) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        userRoles: user.userRoles.map((ur: any) => ({
          roleId: ur.roleId,
          roleName: ur.role.name,
          roleDescription: ur.role.description,
          isActive: ur.isActive,
          assignedAt: ur.assignedAt,
          expiresAt: ur.expiresAt
        }))
      }));
      
      await prisma.$disconnect();
      return { status: 200, body: JSON.stringify(result) };
    } catch (error) {
      context.error('Errore nel debug dei ruoli utente:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
});

// Debug endpoint to assign test role
app.http('debugAssignTestRole', {
  methods: ['POST'],
  route: 'debug/assign-test-role',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const body = await request.json() as { userId: string; roleName?: string };
      const { userId, roleName = 'employee' } = body;
      
      if (!userId) {
        return { status: 400, body: JSON.stringify({ error: 'userId is required' }) };
      }
      
      // Get the role
      const role = await prisma.role.findFirst({
        where: { name: roleName }
      });
      
      if (!role) {
        return { status: 404, body: JSON.stringify({ error: `Role ${roleName} not found` }) };
      }
      
      // Check if user exists
      const user = await prisma.applicationUser.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return { status: 404, body: JSON.stringify({ error: 'User not found' }) };
      }
      
      // Check if role is already assigned
      const existingUserRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: userId,
            roleId: role.id
          }
        }
      });
      
      if (existingUserRole) {
        return { status: 400, body: JSON.stringify({ error: 'Role already assigned to user' }) };
      }
      
      // Assign the role
      const userRole = await prisma.userRole.create({
        data: {
          userId: userId,
          roleId: role.id,
          assignedBy: null,
          isActive: true
        },
        include: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true
            }
          }
        }
      });
      
      await prisma.$disconnect();
      return { status: 200, body: JSON.stringify({
        message: 'Role assigned successfully',
        userRole: {
          id: userRole.id,
          userId: userRole.userId,
          roleId: userRole.roleId,
          roleName: userRole.role.name,
          roleDescription: userRole.role.description,
          isActive: userRole.isActive,
          assignedAt: userRole.assignedAt,
          user: userRole.user
        }
      }) };
    } catch (error) {
      context.error('Errore nell\'assegnazione del ruolo di test:', error);
      return { status: 500, body: JSON.stringify({ error: 'Errore interno del server' }) };
    }
  }
}); 

// POST /api/roles/initialize - Inizializza i ruoli di base del sistema
app.http('initializeRoles', {
  methods: ['POST'],
  route: 'roles/initialize',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const defaultRoles = [
        {
          name: 'superadmin',
          description: 'Super amministratore con tutti i permessi del sistema'
        },
        {
          name: 'admin',
          description: 'Amministratore con permessi di gestione avanzati'
        },
        {
          name: 'consultant',
          description: 'Consulente con accesso ai progetti e alle risorse'
        },
        {
          name: 'hr',
          description: 'Risorse Umane con accesso ai dati dei dipendenti'
        },
        {
          name: 'manager',
          description: 'Manager di progetto con permessi di gestione progetti'
        },
        {
          name: 'administration',
          description: 'Amministrazione con permessi di gestione operativa'
        },
        {
          name: 'segretary',
          description: 'Segretario con permessi di base e supporto'
        }
      ];

      const results = [];
      const errors = [];

      for (const roleData of defaultRoles) {
        try {
          // Verifica se il ruolo esiste già
          const existingRoles = await roleService.getAllRoles();
          const existingRole = existingRoles.find((r: any) => r.name === roleData.name);
          
          if (existingRole) {
            results.push({
              name: roleData.name,
              status: 'already_exists',
              message: `Ruolo ${roleData.name} già esistente`,
              role: existingRole
            });
          } else {
            // Crea il nuovo ruolo
            const newRole = await roleService.createRole(roleData);
            results.push({
              name: roleData.name,
              status: 'created',
              message: `Ruolo ${roleData.name} creato con successo`,
              role: newRole
            });
            context.log(`✅ Ruolo ${roleData.name} creato con successo`);
          }
        } catch (error) {
          errors.push({
            name: roleData.name,
            error: error instanceof Error ? error.message : 'Errore sconosciuto'
          });
          context.error(`❌ Errore nella creazione del ruolo ${roleData.name}:`, error);
        }
      }

      const response = {
        success: errors.length === 0,
        message: errors.length === 0 ? 
          'Tutti i ruoli sono stati inizializzati con successo' : 
          `${results.length} ruoli processati, ${errors.length} errori`,
        results,
        errors: errors.length > 0 ? errors : undefined
      };

      return { 
        status: errors.length === 0 ? 201 : 207, // 207 Multi-Status se ci sono errori
        body: JSON.stringify(response) 
      };
    } catch (error) {
      context.error('Errore nell\'inizializzazione dei ruoli:', error);
      return { 
        status: 500, 
        body: JSON.stringify({ 
          error: 'Errore interno del server durante l\'inizializzazione dei ruoli',
          details: error instanceof Error ? error.message : 'Errore sconosciuto'
        }) 
      };
    }
  }
});

// POST /api/roles/bulk-create - Crea ruoli multipli
app.http('bulkCreateRoles', {
  methods: ['POST'],
  route: 'roles/bulk-create',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as { roles: Array<{ name: string; description?: string }> };
      const { roles } = body;

      if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return { 
          status: 400, 
          body: JSON.stringify({ error: 'Array di ruoli richiesto e non vuoto' }) 
        };
      }

      const results = [];
      const errors = [];

      for (const roleData of roles) {
        try {
          if (!roleData.name) {
            errors.push({
              name: roleData.name || 'unnamed',
              error: 'Nome del ruolo richiesto'
            });
            continue;
          }

          // Verifica se il ruolo esiste già
          const existingRoles = await roleService.getAllRoles();
          const existingRole = existingRoles.find((r: any) => r.name === roleData.name);
          
          if (existingRole) {
            results.push({
              name: roleData.name,
              status: 'already_exists',
              message: `Ruolo ${roleData.name} già esistente`,
              role: existingRole
            });
          } else {
            // Crea il nuovo ruolo
            const newRole = await roleService.createRole(roleData);
            results.push({
              name: roleData.name,
              status: 'created',
              message: `Ruolo ${roleData.name} creato con successo`,
              role: newRole
            });
            context.log(`✅ Ruolo ${roleData.name} creato con successo`);
          }
        } catch (error) {
          errors.push({
            name: roleData.name,
            error: error instanceof Error ? error.message : 'Errore sconosciuto'
          });
          context.error(`❌ Errore nella creazione del ruolo ${roleData.name}:`, error);
        }
      }

      const response = {
        success: errors.length === 0,
        message: errors.length === 0 ? 
          'Tutti i ruoli sono stati creati con successo' : 
          `${results.length} ruoli processati, ${errors.length} errori`,
        results,
        errors: errors.length > 0 ? errors : undefined
      };

      return { 
        status: errors.length === 0 ? 201 : 207, // 207 Multi-Status se ci sono errori
        body: JSON.stringify(response) 
      };
    } catch (error) {
      context.error('Errore nella creazione bulk dei ruoli:', error);
      return { 
        status: 500, 
        body: JSON.stringify({ 
          error: 'Errore interno del server durante la creazione bulk dei ruoli',
          details: error instanceof Error ? error.message : 'Errore sconosciuto'
        }) 
      };
    }
  }
}); 