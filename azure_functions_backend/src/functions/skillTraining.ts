import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { skillTrainingService } from '../services/skill-training.service';
import { verifyToken } from '../middlewares/auth';
import { authService } from '../services/auth.service';

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
      const body = await request.json() as any;
      
      // Get current user from JWT token
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          jsonBody: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decodedToken = verifyToken(token);
      
      if (!decodedToken || !decodedToken.userId) {
        return {
          status: 401,
          jsonBody: { error: 'Invalid token' }
        };
      }

      // Get current user with roles and company info
      const currentUser = await authService.getUserById(decodedToken.userId);
      if (!currentUser) {
        return {
          status: 401,
          jsonBody: { error: 'User not found' }
        };
      }

      // Determine company ID based on user role
      let companyId: string | undefined;
      if (currentUser) {
        const userRoles = currentUser.userRoles || [];
        const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
        
        if (isSuperAdmin) {
          // Se l'utente corrente è super admin, il nuovo training viene associato alla sua società
          companyId = currentUser.company || currentUser.id;
        } else {
          // Se l'utente corrente non è super admin, il nuovo training viene associato alla società dell'utente corrente
          companyId = currentUser.company || undefined;
        }
      }

      // Add company to the training data
      const trainingData = {
        ...body,
        company: companyId
      };

      const training = await skillTrainingService.create(trainingData);
      
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

      const body = await request.json() as any;
      
      // Get current user from JWT token
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          jsonBody: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decodedToken = verifyToken(token);
      
      if (!decodedToken || !decodedToken.userId) {
        return {
          status: 401,
          jsonBody: { error: 'Invalid token' }
        };
      }

      // Get current user with roles and company info
      const currentUser = await authService.getUserById(decodedToken.userId);
      if (!currentUser) {
        return {
          status: 401,
          jsonBody: { error: 'User not found' }
        };
      }

      // Determine company ID based on user role
      let companyId: string | undefined;
      if (currentUser) {
        const userRoles = currentUser.userRoles || [];
        const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
        
        if (isSuperAdmin) {
          // Se l'utente corrente è super admin, il training viene associato alla sua società
          companyId = currentUser.company || currentUser.id;
        } else {
          // Se l'utente corrente non è super admin, il training viene associato alla società dell'utente corrente
          companyId = currentUser.company || undefined;
        }
      }

      // Add company to the training data
      const trainingData = {
        ...body,
        company: companyId
      };

      const training = await skillTrainingService.update(id, trainingData);
      
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

// GET /api/skill-trainings/company/:companyId - Get skill trainings by company
app.http('getSkillTrainingsByCompany', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skill-trainings/company/{companyId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const companyId = request.params.companyId;
      if (!companyId) {
        return {
          status: 400,
          jsonBody: { message: 'Company ID is required' }
        };
      }

      const trainings = await skillTrainingService.getByCompany(companyId);
      
      return {
        status: 200,
        jsonBody: trainings
      };
    } catch (error) {
      context.error('Error getting skill trainings by company:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 