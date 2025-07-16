import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { skillTrainingService } from '../services/skill-training.service';

// GET /api/skill-trainings - Get all skill trainings
app.http('getAllSkillTrainings', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skill-trainings',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const trainings = await skillTrainingService.getAll();
      return {
        status: 200,
        jsonBody: trainings
      };
    } catch (error) {
      context.error('Error getting all skill trainings:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/skill-trainings/:id - Get skill training by ID
app.http('getSkillTrainingById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Training ID is required' }
        };
      }

      const training = await skillTrainingService.getById(id);
      if (!training) {
        return {
          status: 404,
          jsonBody: { message: 'Not found' }
        };
      }

      return {
        status: 200,
        jsonBody: training
      };
    } catch (error) {
      context.error('Error getting skill training by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/skill-trainings - Create new skill training
app.http('createSkillTraining', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'skill-trainings',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const training = await skillTrainingService.create(body);
      
      return {
        status: 201,
        jsonBody: training
      };
    } catch (error) {
      context.error('Error creating skill training:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/skill-trainings/:id - Update skill training
app.http('updateSkillTraining', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Training ID is required' }
        };
      }

      const body = await request.json();
      const training = await skillTrainingService.update(id, body);
      
      return {
        status: 200,
        jsonBody: training
      };
    } catch (error) {
      context.error('Error updating skill training:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/skill-trainings/:id - Delete skill training
app.http('deleteSkillTraining', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Training ID is required' }
        };
      }

      await skillTrainingService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting skill training:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 