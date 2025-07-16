import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { projectSkillService } from '../services/projectSkill.service';

// GET /api/project-skills - Get all project skills
app.http('getAllProjectSkills', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const skills = await projectSkillService.getAll();
      return {
        status: 200,
        jsonBody: skills
      };
    } catch (error) {
      context.error('Error getting all project skills:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/project-skills/:id - Get project skill by ID
app.http('getProjectSkillById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Skill ID is required' }
        };
      }

      const skill = await projectSkillService.getById(id);
      if (!skill) {
        return {
          status: 404,
          jsonBody: { message: 'Not found' }
        };
      }

      return {
        status: 200,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error getting project skill by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/project-skills/hard/:projectId - Get hard skills by project ID
app.http('getHardSkillsByProjectId', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills/hard/{projectId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const projectId = request.params.projectId;
      if (!projectId) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      const skills = await projectSkillService.getHardSkillsByProjectId(projectId);
      return {
        status: 200,
        jsonBody: skills
      };
    } catch (error) {
      context.error('Error getting hard skills by project ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/project-skills/soft/:projectId - Get soft skills by project ID
app.http('getSoftSkillsByProjectId', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills/soft/{projectId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const projectId = request.params.projectId;
      if (!projectId) {
        return {
          status: 400,
          jsonBody: { message: 'Project ID is required' }
        };
      }

      const skills = await projectSkillService.getSoftSkillsByProjectId(projectId);
      return {
        status: 200,
        jsonBody: skills
      };
    } catch (error) {
      context.error('Error getting soft skills by project ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/project-skills/hard - Create hard skill
app.http('createHardSkill', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'project-skills/hard',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const skill = await projectSkillService.createHardSkill(body);
      
      return {
        status: 201,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error creating hard skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/project-skills/soft - Create soft skill
app.http('createSoftSkill', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'project-skills/soft',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const skill = await projectSkillService.createSoftSkill(body);
      
      return {
        status: 201,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error creating soft skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/project-skills/:id - Update project skill
app.http('updateProjectSkill', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Skill ID is required' }
        };
      }

      const body = await request.json();
      const skill = await projectSkillService.update(id, body);
      
      return {
        status: 200,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error updating project skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/project-skills/:id - Delete project skill
app.http('deleteProjectSkill', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Skill ID is required' }
        };
      }

      await projectSkillService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting project skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 