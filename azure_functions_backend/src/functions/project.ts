import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { projectService } from '../services/project.service';
import { authService } from '../services/auth.service';

// GET /api/projects - Get all projects
app.http('getAllProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      // Get company filter from query parameters
      const url = new URL(request.url);
      const companyId = url.searchParams.get('company');
      
      const projects = await projectService.getAll(companyId || undefined);
      
      return {
        status: 200,
        jsonBody: projects
      };
    } catch (error) {
      context.error('Error getting all projects:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/projects/user/my-projects - Get user's projects (authenticated)
app.http('getUserProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/user/my-projects',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          jsonBody: { message: 'User not authenticated' }
        };
      }
      
      const token = authHeader.substring(7);
      const user = authService.verifyToken(token);
      
      if (!user || !user.userId) {
        return {
          status: 401,
          jsonBody: { message: 'User not authenticated' }
        };
      }

      const projects = await projectService.getUserProjects(user.userId);
      return {
        status: 200,
        jsonBody: projects
      };
    } catch (error) {
      context.error('Error getting user projects:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/projects/:id - Get project by ID
app.http('getProjectById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      const project = await projectService.getById(id);
      if (!project) {
        return {
          status: 404,
          jsonBody: { message: 'Not found' }
        };
      }

      return {
        status: 200,
        jsonBody: project
      };
    } catch (error) {
      context.error('Error getting project by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/projects - Create new project
app.http('createProject', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const project = await projectService.create(body);
      
      return {
        status: 201,
        jsonBody: project
      };
    } catch (error) {
      context.error('Error creating project:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/projects/:id - Update project
app.http('updateProject', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      const body = await request.json();
      const project = await projectService.update(id, body);
      
      return {
        status: 200,
        jsonBody: project
      };
    } catch (error) {
      context.error('Error updating project:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/projects/:id - Delete project
app.http('deleteProject', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'projects/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      await projectService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting project:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/projects/smart-search - Smart search projects by employee skills
app.http('smartSearchProjects', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects/smart-search',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as {
        employeeId: string;
        includeSoftSkills?: boolean;
        companyId?: string;
      };
      const { employeeId, includeSoftSkills = true, companyId } = body;

      if (!employeeId) {
        return {
          status: 400,
          jsonBody: { message: 'Employee ID is required' }
        };
      }

      const projects = await projectService.smartSearchByEmployeeSkills(
        employeeId, 
        includeSoftSkills, 
        companyId
      );
      
      return {
        status: 200,
        jsonBody: {
          projects,
          totalMatches: projects.filter(p => (p.skillMatchScore || 0) > 0).length,
          includeSoftSkills
        }
      };
    } catch (error) {
      context.error('Error performing smart search:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/projects/smart-search-employees - Smart search employees by project skills
app.http('smartSearchEmployees', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'projects/smart-search-employees',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as {
        projectId: string;
        includeSoftSkills?: boolean;
        companyId?: string;
      };
      const { projectId, includeSoftSkills = true, companyId } = body;

      if (!projectId) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      const employees = await projectService.smartSearchEmployeesByProjectSkills(
        projectId, 
        includeSoftSkills, 
        companyId
      );
      
      return {
        status: 200,
        jsonBody: {
          employees,
          totalMatches: employees.filter(e => (e.skillMatchScore || 0) > 0).length,
          includeSoftSkills
        }
      };
    } catch (error) {
      context.error('Error performing smart search employees:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 