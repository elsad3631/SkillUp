import { app, HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { userService } from '../services/user.service';

// GET /api/users - Get all users
app.http('getAllUsers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const users = await userService.getAll();
      return {
        status: 200,
        jsonBody: users
      };
    } catch (error) {
      context.error('Error getting all users:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// GET /api/users/:id - Get user by ID
app.http('getUserById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'User ID is required' }
        };
      }

      const user = await userService.getById(id);
      if (!user) {
        return {
          status: 404,
          jsonBody: { message: 'Not found' }
        };
      }

      return {
        status: 200,
        jsonBody: user
      };
    } catch (error) {
      context.error('Error getting user by ID:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// POST /api/users - Create new user
app.http('createUser', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'users',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json();
      const user = await userService.create(body);
      
      return {
        status: 201,
        jsonBody: user
      };
    } catch (error) {
      context.error('Error creating user:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// PUT /api/users/:id - Update user
app.http('updateUser', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'users/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'User ID is required' }
        };
      }

      const body = await request.json();
      const user = await userService.update(id, body);
      
      return {
        status: 200,
        jsonBody: user
      };
    } catch (error) {
      context.error('Error updating user:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
});

// DELETE /api/users/:id - Delete user
app.http('deleteUser', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'users/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const id = request.params.id;
      if (!id) {
        return {
          status: 400,
          jsonBody: { message: 'User ID is required' }
        };
      }

      await userService.remove(id);
      
      return {
        status: 204
      };
    } catch (error) {
      context.error('Error deleting user:', error);
      return {
        status: 500,
        jsonBody: { message: 'Internal server error' }
      };
    }
  }
}); 