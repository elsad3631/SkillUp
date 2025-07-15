import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { applicationUserService } from '../services/applicationuser.service';
import { projectService } from '../services/project.service';

export async function applicationUserGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const users = await applicationUserService.getAll();

    return {
      status: 200,
      jsonBody: users
    };

  } catch (error: any) {
    context.log('Get all users error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve users' }
    };
  }
}

export async function applicationUserGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'User ID is required' }
      };
    }

    const user = await applicationUserService.getById(id);

    if (!user) {
      return {
        status: 404,
        jsonBody: { error: 'User not found' }
      };
    }

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Get user by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user' }
    };
  }
}

export async function applicationUserCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;

    if (!body.username || !body.email) {
      return {
        status: 400,
        jsonBody: { error: 'Username and email are required' }
      };
    }

    const user = await applicationUserService.create(body);

    return {
      status: 201,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Create user error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create user' }
    };
  }
}

export async function applicationUserUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'User ID is required' }
      };
    }

    const body = await request.json() as any;

    const user = await applicationUserService.update(id, body);

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Update user error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update user' }
    };
  }
}

export async function applicationUserDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'User ID is required' }
      };
    }

    await applicationUserService.remove(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete user error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete user' }
    };
  }
}

export async function applicationUserSearch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const role = url.searchParams.get('role');
    const department = url.searchParams.get('department');
    const isAvailable = url.searchParams.get('isAvailable');

    // Get all users first
    let users = await applicationUserService.getAll();

    // Apply filters
    if (role) {
      users = users.filter((user: any) => user.roles.includes(role));
    }

    if (department) {
      users = users.filter((user: any) => user.department === department);
    }

    if (isAvailable !== null && isAvailable !== undefined) {
      const available = isAvailable === 'true';
      users = users.filter((user: any) => user.isAvailable === available);
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      users = users.filter((user: any) => 
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.department?.toLowerCase().includes(searchTerm)
      );
    }

    return {
      status: 200,
      jsonBody: users
    };

  } catch (error: any) {
    context.log('Search users error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to search users' }
    };
  }
}

export async function applicationUserGetByRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const role = request.params.role;
    if (!role) {
      return {
        status: 400,
        jsonBody: { error: 'Role is required' }
      };
    }

    const users = await applicationUserService.getByRole(role);

    return {
      status: 200,
      jsonBody: users
    };

  } catch (error: any) {
    context.log('Get users by role error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve users by role' }
    };
  }
}

export async function applicationUserGetByUsername(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const username = request.params.username;
    if (!username) {
      return {
        status: 400,
        jsonBody: { error: 'Username is required' }
      };
    }

    const user = await applicationUserService.getByUsername(username);

    if (!user) {
      return {
        status: 404,
        jsonBody: { error: 'User not found' }
      };
    }

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Get user by username error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user by username' }
    };
  }
}

export async function applicationUserGetByEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const email = request.params.email;
    if (!email) {
      return {
        status: 400,
        jsonBody: { error: 'Email is required' }
      };
    }

    const user = await applicationUserService.getByEmail(email);

    if (!user) {
      return {
        status: 404,
        jsonBody: { error: 'User not found' }
      };
    }

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Get user by email error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user by email' }
    };
  }
}

export async function applicationUserUpdateRoles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PATCH') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'User ID is required' }
      };
    }

    const body = await request.json() as any;
    const { roles } = body;

    if (!Array.isArray(roles)) {
      return {
        status: 400,
        jsonBody: { error: 'Roles must be an array' }
      };
    }

    const user = await applicationUserService.updateRoles(id, roles);

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Update user roles error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update user roles' }
    };
  }
}

export async function applicationUserGetAvailable(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const users = await applicationUserService.getAvailableUsers();

    return {
      status: 200,
      jsonBody: users
    };

  } catch (error: any) {
    context.log('Get available users error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve available users' }
    };
  }
}

export async function applicationUserGetAdmins(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const admins = await applicationUserService.getByRole('admin');

    return {
      status: 200,
      jsonBody: admins
    };

  } catch (error: any) {
    context.log('Get admins error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve admins' }
    };
  }
}

export async function applicationUserGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const allUsers = await applicationUserService.getAll();
    
    const stats = {
      total: allUsers.length,
      available: allUsers.filter((u: any) => u.isAvailable).length,
      roles: {} as Record<string, number>,
      departments: {} as Record<string, number>,
    };
    
    // Count by roles
    allUsers.forEach((user: any) => {
      user.roles.forEach((role: string) => {
        stats.roles[role] = (stats.roles[role] || 0) + 1;
      });
    });
    
    // Count by departments
    allUsers.forEach((user: any) => {
      if (user.department) {
        stats.departments[user.department] = (stats.departments[user.department] || 0) + 1;
      }
    });

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user stats' }
    };
  }
}

export async function applicationUserGetProjects(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'User ID is required' }
      };
    }

    // Note: This would need getUserProjects method in projectService
    // For now returning a placeholder
    return {
      status: 501,
      jsonBody: { error: 'Get user projects functionality not yet implemented in project service' }
    };

  } catch (error: any) {
    context.log('Get user projects error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user projects' }
    };
  }
}

// Register HTTP triggers
app.http('applicationUserGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers',
  handler: applicationUserGetAll
});

app.http('applicationUserGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/{id}',
  handler: applicationUserGetById
});

app.http('applicationUserCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'applicationusers',
  handler: applicationUserCreate
});

app.http('applicationUserUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'applicationusers/{id}',
  handler: applicationUserUpdate
});

app.http('applicationUserDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'applicationusers/{id}',
  handler: applicationUserDelete
});

app.http('applicationUserSearch', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/search',
  handler: applicationUserSearch
});

app.http('applicationUserGetByRole', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/role/{role}',
  handler: applicationUserGetByRole
});

app.http('applicationUserGetByUsername', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/username/{username}',
  handler: applicationUserGetByUsername
});

app.http('applicationUserGetByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/email/{email}',
  handler: applicationUserGetByEmail
});

app.http('applicationUserUpdateRoles', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'applicationusers/{id}/roles',
  handler: applicationUserUpdateRoles
});

app.http('applicationUserGetAvailable', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/available',
  handler: applicationUserGetAvailable
});

app.http('applicationUserGetAdmins', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/admins',
  handler: applicationUserGetAdmins
});

app.http('applicationUserGetStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/stats',
  handler: applicationUserGetStats
});

app.http('applicationUserGetProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationusers/{id}/projects',
  handler: applicationUserGetProjects
}); 