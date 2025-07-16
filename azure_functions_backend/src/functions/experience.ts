import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { experienceService } from '../services/experience.service';

// GET /api/experiences - Get all experiences
app.http('getAllExperiences', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'experiences',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const experiences = await experienceService.getAll();
      return {
        status: 200,
        jsonBody: experiences
      };
    } catch (error) {
      context.error('Error getting all experiences:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/experiences/:id - Get experience by ID
app.http('getExperienceById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Experience ID is required' }
        };
      }

      const experience = await experienceService.getById(id);
      if (!experience) {
        return {
          status: 404,
          jsonBody: { message: 'Not found' }
        };
      }

      return {
        status: 200,
        jsonBody: experience
      };
    } catch (error) {
      context.error('Error getting experience by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/experiences - Create new experience
app.http('createExperience', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'experiences',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const experience = await experienceService.create(body);
      
      return {
        status: 201,
        jsonBody: experience
      };
    } catch (error) {
      context.error('Error creating experience:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/experiences/:id - Update experience
app.http('updateExperience', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Experience ID is required' }
        };
      }

      const body = await request.json();
      const experience = await experienceService.update(id, body);
      
      return {
        status: 200,
        jsonBody: experience
      };
    } catch (error) {
      context.error('Error updating experience:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/experiences/:id - Delete experience
app.http('deleteExperience', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'Experience ID is required' }
        };
      }

      await experienceService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting experience:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 