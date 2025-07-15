import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { projectService } from '../services/project.service';
import { authService } from '../services/auth.service';

export async function projectGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projects = await projectService.getAllProjects();

    return {
      status: 200,
      jsonBody: projects
    };

  } catch (error: any) {
    context.log('Get all projects error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve projects' }
    };
  }
}

export async function projectGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project ID is required' }
      };
    }

    const project = await projectService.getProjectById(id);

    return {
      status: 200,
      jsonBody: project
    };

  } catch (error: any) {
    context.log('Get project by ID error:', error);
    
    if (error.message === 'Project not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project not found' }
      };
    }
    
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project' }
    };
  }
}

export async function projectCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;

    if (!body.name || !body.status) {
      return {
        status: 400,
        jsonBody: { error: 'Project name and status are required' }
      };
    }

    const project = await projectService.createProject(body);

    return {
      status: 201,
      jsonBody: project
    };

  } catch (error: any) {
    context.log('Create project error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create project' }
    };
  }
}

export async function projectUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project ID is required' }
      };
    }

    const body = await request.json() as any;

    const project = await projectService.updateProject(id, body);

    return {
      status: 200,
      jsonBody: project
    };

  } catch (error: any) {
    context.log('Update project error:', error);
    
    if (error.message === 'Project not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update project' }
    };
  }
}

export async function projectDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project ID is required' }
      };
    }

    await projectService.deleteProject(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete project error:', error);
    
    if (error.message === 'Project not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project not found' }
      };
    }
    
    if (error.message === 'Cannot delete project with active assignments') {
      return {
        status: 409,
        jsonBody: { error: 'Cannot delete project with active assignments' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete project' }
    };
  }
}

export async function projectAssignUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = request.params.id;
    if (!projectId) {
      return {
        status: 400,
        jsonBody: { error: 'Project ID is required' }
      };
    }

    const body = await request.json() as any;

    if (!body.applicationUserId || !body.roleOnProject || !body.assignmentStartDate || !body.allocationPercentage) {
      return {
        status: 400,
        jsonBody: { 
          error: 'applicationUserId, roleOnProject, assignmentStartDate, and allocationPercentage are required' 
        }
      };
    }

    const assignment = await projectService.assignUserToProject(projectId, body);

    return {
      status: 201,
      jsonBody: assignment
    };

  } catch (error: any) {
    context.log('Assign user to project error:', error);
    
    if (error.message === 'User is already assigned to this project') {
      return {
        status: 409,
        jsonBody: { error: 'User is already assigned to this project' }
      };
    }
    
    if (error.message === 'User is not available for assignment') {
      return {
        status: 409,
        jsonBody: { error: 'User is not available for assignment' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to assign user to project' }
    };
  }
}

export async function projectGetMyProjects(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'No token provided' }
      };
    }

    const token = authHeader.substring(7);
    const verifyResult = await authService.verifyToken(token);
    const userId = verifyResult.user.id;

    // Note: This would need getUserProjects method in projectService
    // For now returning a placeholder
    return {
      status: 501,
      jsonBody: { error: 'Get user projects functionality not yet implemented in project service' }
    };

  } catch (error: any) {
    context.log('Get my projects error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user projects' }
    };
  }
}

// Register HTTP triggers
app.http('projectGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: projectGetAll
});

app.http('projectGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: projectGetById
});

app.http('projectCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: projectCreate
});

app.http('projectUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: projectUpdate
});

app.http('projectDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: projectDelete
});

app.http('projectAssignUser', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects/{id}/assign',
  handler: projectAssignUser
});

app.http('projectGetMyProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/my',
  handler: projectGetMyProjects
}); 