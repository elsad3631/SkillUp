import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { skillService } from '../services/skill.service';

// GET /api/skills - Get all skills
app.http('getAllSkills', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skills',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const skills = await skillService.getAll();
      return {
        status: 200,
        jsonBody: skills
      };
    } catch (error) {
      context.error('Error getting all skills:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/skills/:id - Get skill by ID
app.http('getSkillById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Skill ID is required' }
        };
      }

      const skill = await skillService.getById(id);
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
      context.error('Error getting skill by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/skills - Create new skill
app.http('createSkill', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'skills',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const skill = await skillService.create(body);
      
      return {
        status: 201,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error creating skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/skills/:id - Update skill
app.http('updateSkill', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
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
      const skill = await skillService.update(id, body);
      
      return {
        status: 200,
        jsonBody: skill
      };
    } catch (error) {
      context.error('Error updating skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/skills/:id - Delete skill
app.http('deleteSkill', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Skill ID is required' }
        };
      }

      await skillService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting skill:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 