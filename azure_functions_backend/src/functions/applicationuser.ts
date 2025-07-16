import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { applicationUserService } from '../services/applicationuser.service';

type ApplicationUser = {
  id: string;
  username: string;
  email: string;
  roles: string[];
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  placeOfBirth?: string | null;
  address?: string | null;
  phone?: string | null;
  currentRole?: string | null;
  department?: string | null;
  isAvailable: boolean;
};

// GET /api/applicationuser - Get all users
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
    console.log("APPLICATION USERS:", users); // DEBUG

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

// GET /api/applicationuser/{id} - Get user by ID
export async function applicationUserGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
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

// POST /api/applicationuser - Create new user
export async function applicationUserCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const user = await applicationUserService.create(body);

    return {
      status: 201,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Create user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create user' }
    };
  }
}

// PUT /api/applicationuser/{id} - Update user
export async function applicationUserUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const user = await applicationUserService.update(id, body);

    return {
      status: 200,
      jsonBody: user
    };

  } catch (error: any) {
    context.log('Update user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update user' }
    };
  }
}

// DELETE /api/applicationuser/{id} - Remove user
export async function applicationUserRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await applicationUserService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Remove user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to remove user' }
    };
  }
}

// GET /api/applicationuser/role/{role} - Get users by role
export async function applicationUserGetByRole(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const role = (context.triggerMetadata?.role as string) || request.url.split('/').pop() || '';
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

// GET /api/applicationuser/username/{username} - Get user by username
export async function applicationUserGetByUsername(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const username = (context.triggerMetadata?.username as string) || request.url.split('/').pop() || '';
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

// GET /api/applicationuser/email/{email} - Get user by email
export async function applicationUserGetByEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const email = (context.triggerMetadata?.email as string) || request.url.split('/').pop() || '';
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

// PATCH /api/applicationuser/{id}/roles - Update user roles
export async function applicationUserUpdateRoles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PATCH') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as { roles: string[] };
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
      status: 500,
      jsonBody: { error: error.message || 'Failed to update user roles' }
    };
  }
}

// GET /api/applicationuser/filter/available - Get available users
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

// GET /api/applicationuser/filter/employees - Get employees (users with 'employee' role)
export async function applicationUserGetEmployees(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const employees = await applicationUserService.getByRole('employee');

    return {
      status: 200,
      jsonBody: employees
    };

  } catch (error: any) {
    context.log('Get employees error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve employees' }
    };
  }
}

// GET /api/applicationuser/filter/admins - Get admins (users with 'admin' role)
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

// PATCH /api/applicationuser/admin/bulk-roles - Update multiple users roles
export async function applicationUserUpdateMultipleRoles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PATCH') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as { userIds: string[], roles: string[] };
    const { userIds, roles } = body;
    
    if (!Array.isArray(userIds) || !Array.isArray(roles)) {
      return {
        status: 400,
        jsonBody: { error: 'userIds and roles must be arrays' }
      };
    }

    const promises = userIds.map((id: string) => applicationUserService.updateRoles(id, roles));
    await Promise.all(promises);

    return {
      status: 200,
      jsonBody: { message: 'Roles updated successfully', count: userIds.length }
    };

  } catch (error: any) {
    context.log('Update multiple users roles error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update multiple users roles' }
    };
  }
}

// GET /api/applicationuser/admin/search - Search users
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
    
    // Basic search implementation - can be enhanced
    let users = await applicationUserService.getAll();
    
    if (role) {
      users = users.filter((user: ApplicationUser) => user.roles.includes(role));
    }
    
    if (department) {
      users = users.filter((user: ApplicationUser) => user.department === department);
    }
    
    if (isAvailable !== null) {
      const available = isAvailable === 'true';
      users = users.filter((user: ApplicationUser) => user.isAvailable === available);
    }
    
    if (query) {
      const searchTerm = query.toLowerCase();
      users = users.filter((user: ApplicationUser) => 
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

// GET /api/applicationuser/admin/stats - Get user statistics
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
      available: allUsers.filter((u: ApplicationUser) => u.isAvailable).length,
      roles: {} as Record<string, number>,
      departments: {} as Record<string, number>,
    };
    
    // Count by roles
    allUsers.forEach((user: ApplicationUser) => {
      user.roles.forEach((role: string) => {
        stats.roles[role] = (stats.roles[role] || 0) + 1;
      });
    });
    
    // Count by departments
    allUsers.forEach((user: ApplicationUser) => {
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
      jsonBody: { error: error.message || 'Failed to retrieve user statistics' }
    };
  }
}

// GET /api/applicationuser/{id}/projects - Get user projects
export async function applicationUserGetProjects(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    
    // Import projectService here to avoid circular dependencies
    const { projectService } = await import('../services/project.service');
    
    const projects = await projectService.getUserProjects(id);

    return {
      status: 200,
      jsonBody: projects
    };

  } catch (error: any) {
    context.log('Get user projects error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to fetch user projects' }
    };
  }
}

// Register all routes
app.http('applicationUserGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser',
  handler: applicationUserGetAll
});

app.http('applicationUserGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/{id}',
  handler: applicationUserGetById
});

app.http('applicationUserCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'applicationuser',
  handler: applicationUserCreate
});

app.http('applicationUserUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'applicationuser/{id}',
  handler: applicationUserUpdate
});

app.http('applicationUserRemove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'applicationuser/{id}',
  handler: applicationUserRemove
});

app.http('applicationUserGetByRole', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/role/{role}',
  handler: applicationUserGetByRole
});

app.http('applicationUserGetByUsername', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/username/{username}',
  handler: applicationUserGetByUsername
});

app.http('applicationUserGetByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/email/{email}',
  handler: applicationUserGetByEmail
});

app.http('applicationUserUpdateRoles', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'applicationuser/{id}/roles',
  handler: applicationUserUpdateRoles
});

app.http('applicationUserGetAvailable', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/filter/available',
  handler: applicationUserGetAvailable
});

app.http('applicationUserGetEmployees', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/filter/employees',
  handler: applicationUserGetEmployees
});

app.http('applicationUserGetAdmins', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/filter/admins',
  handler: applicationUserGetAdmins
});

app.http('applicationUserGetProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/{id}/projects',
  handler: applicationUserGetProjects
});

app.http('applicationUserGetStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/admin/stats',
  handler: applicationUserGetStats
});

app.http('applicationUserSearch', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'applicationuser/admin/search',
  handler: applicationUserSearch
});

app.http('applicationUserUpdateMultipleRoles', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'applicationuser/admin/bulk-roles',
  handler: applicationUserUpdateMultipleRoles
}); 