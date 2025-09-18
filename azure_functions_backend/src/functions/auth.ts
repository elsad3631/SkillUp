import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { authService } from '../services/auth.service';
import * as fs from 'fs';
import * as path from 'path';

// POST /api/auth/register - Register new user
export async function authRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    
    const user = await authService.register(body);

    return {
      status: 201,
      jsonBody: user
    };

  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === 'P2002') {
      return {
        status: 400,
        jsonBody: { error: 'Email or username already exists' }
      };
    } else {
      return {
        status: 500,
        jsonBody: { error: 'Registration failed' }
      };
    }
  }
}

// POST /api/auth/login - Login user
export async function authLogin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const { token, user } = await authService.login(body);

    return {
      status: 200,
      jsonBody: { token, user }
    };

  } catch (error: any) {
    context.log('Login error:', error);
    return {
      status: 401,
      jsonBody: { error: 'Invalid credentials' }
    };
  }
}

// POST /api/auth/reset-password - Reset password
export async function authResetPassword(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    await authService.resetPassword(body);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Reset password error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to reset password' }
    };
  }
}

// POST /api/auth/verify_token - Verify token
export async function authVerifyToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as { api_token: string };
    const { api_token } = body;

    try {
      const payload = authService.verifyToken(api_token);
      // Recupera l'utente dal DB
      const user = await authService.getUserById(payload.userId);
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
    } catch (err) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

  } catch (error: any) {
    context.log('Verify token error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to verify token' }
    };
  }
}

// PUT /api/auth/update-email - Update email (protected route)
export async function authUpdateEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // TODO: Implement JWT authentication middleware
    // For now, we'll extract userId from headers or body
    const body = await request.json() as { newEmail: string; currentPassword: string; userId?: string };
    const { newEmail, currentPassword, userId } = body;

    if (!userId) {
      return {
        status: 401,
        jsonBody: { error: 'Unauthorized' }
      };
    }

    if (!newEmail || !currentPassword) {
      return {
        status: 400,
        jsonBody: { error: 'New email and current password are required' }
      };
    }

    try {
      const updatedUser = await authService.updateEmail(userId, newEmail, currentPassword);
      return {
        status: 200,
        jsonBody: { message: 'Email updated successfully', user: updatedUser }
      };
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return {
          status: 400,
          jsonBody: { error: 'Current password is incorrect' }
        };
      }
      if (error.message === 'Email already in use') {
        return {
          status: 400,
          jsonBody: { error: 'Email already in use' }
        };
      }
      return {
        status: 500,
        jsonBody: { error: 'Failed to update email' }
      };
    }

  } catch (error: any) {
    context.log('Update email error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to update email' }
    };
  }
}

// PUT /api/auth/update-password - Update password (protected route)
export async function authUpdatePassword(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // TODO: Implement JWT authentication middleware
    // For now, we'll extract userId from headers or body
    const body = await request.json() as { currentPassword: string; newPassword: string; confirmPassword: string; userId?: string };
    const { currentPassword, newPassword, confirmPassword, userId } = body;

    if (!userId) {
      return {
        status: 401,
        jsonBody: { error: 'Unauthorized' }
      };
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        status: 400,
        jsonBody: { error: 'All password fields are required' }
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        status: 400,
        jsonBody: { error: 'New passwords do not match' }
      };
    }

    try {
      await authService.updatePassword(userId, currentPassword, newPassword);
      return {
        status: 200,
        jsonBody: { message: 'Password updated successfully' }
      };
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return {
          status: 400,
          jsonBody: { error: 'Current password is incorrect' }
        };
      }
      if (error.message === 'New password must be at least 8 characters long') {
        return {
          status: 400,
          jsonBody: { error: 'New password must be at least 8 characters long' }
        };
      }
      return {
        status: 500,
        jsonBody: { error: 'Failed to update password' }
      };
    }

  } catch (error: any) {
    context.log('Update password error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to update password' }
    };
  }
}

// GET /api/auth/sectors - Get available sectors
app.http('getSectors', {
  methods: ['GET'],
  route: 'auth/sectors',
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const skillsPath = path.join(__dirname, '../../skills-list.json');
      const skillsData = fs.readFileSync(skillsPath, 'utf8');
      const skillsList = JSON.parse(skillsData);
      
      // Estrai solo i nomi dei settori
      const sectors = Object.keys(skillsList).map(sectorKey => ({
        key: sectorKey,
        name: sectorKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }));
      
      return { 
        status: 200, 
        jsonBody: sectors 
      };
    } catch (error) {
      context.error('Errore nel recupero dei settori:', error);
      return { 
        status: 500, 
        jsonBody: { error: 'Errore interno del server' } 
      };
    }
  }
});

// Register all routes
app.http('authRegister', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: authRegister
});

app.http('authLogin', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: authLogin
});

app.http('authResetPassword', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/reset-password',
  handler: authResetPassword
});

app.http('authVerifyToken', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/verify_token',
  handler: authVerifyToken
});

app.http('authUpdateEmail', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'auth/update-email',
  handler: authUpdateEmail
});

app.http('authUpdatePassword', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'auth/update-password',
  handler: authUpdatePassword
}); 