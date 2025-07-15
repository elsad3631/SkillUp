import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { authService } from '../services/auth.service';

export async function authLogin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;
    const { email, password } = body;

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Email and password are required' }
      };
    }

    const result = await authService.login({ email, password });

    return {
      status: 200,
      jsonBody: {
        message: 'Login successful',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          roles: result.user.roles
        }
      }
    };

  } catch (error: any) {
    context.log('Login error:', error);
    return {
      status: 401,
      jsonBody: { error: error.message || 'Invalid credentials' }
    };
  }
}

export async function authRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;
    const { 
      first_name, 
      last_name, 
      email, 
      password, 
      username,
      roles,
      currentRole,
      department,
      dateOfBirth,
      placeOfBirth,
      address,
      phone,
      isAvailable
    } = body;

    if (!first_name || !last_name || !email || !password) {
      return {
        status: 400,
        jsonBody: { error: 'First name, last name, email and password are required' }
      };
    }

    const user = await authService.register({
      first_name,
      last_name,
      email,
      password,
      username,
      roles,
      currentRole,
      department,
      dateOfBirth,
      placeOfBirth,
      address,
      phone,
      isAvailable
    });

    return {
      status: 201,
      jsonBody: {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          roles: user.roles
        }
      }
    };

  } catch (error: any) {
    context.log('Registration error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Registration failed' }
    };
  }
}

export async function authVerifyToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
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

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const result = await authService.verifyToken(token);

    return {
      status: 200,
      jsonBody: {
        message: 'Token is valid',
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          username: result.user.username,
          roles: result.user.roles,
          hardSkills: result.user.hardSkills,
          softSkills: result.user.softSkills,
          experiences: result.user.experiences
        },
        decoded: result.decoded
      }
    };

  } catch (error: any) {
    context.log('Token verification error:', error);
    return {
      status: 401,
      jsonBody: { error: error.message || 'Invalid token' }
    };
  }
}

export async function authChangePassword(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
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

    const body = await request.json() as any;
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return {
        status: 400,
        jsonBody: { error: 'Old password and new password are required' }
      };
    }

    if (newPassword.length < 8) {
      return {
        status: 400,
        jsonBody: { error: 'New password must be at least 8 characters long' }
      };
    }

    const result = await authService.changePassword(userId, oldPassword, newPassword);

    return {
      status: 200,
      jsonBody: result
    };

  } catch (error: any) {
    context.log('Change password error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Password change failed' }
    };
  }
}

export async function authResetPassword(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;
    const { resetToken, newPassword } = body;

    if (!resetToken || !newPassword) {
      return {
        status: 400,
        jsonBody: { error: 'Reset token and new password are required' }
      };
    }

    if (newPassword.length < 8) {
      return {
        status: 400,
        jsonBody: { error: 'New password must be at least 8 characters long' }
      };
    }

    const result = await authService.resetPassword(resetToken, newPassword);

    return {
      status: 200,
      jsonBody: result
    };

  } catch (error: any) {
    context.log('Reset password error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Password reset failed' }
    };
  }
}

export async function authRequestPasswordReset(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;
    const { email } = body;

    if (!email) {
      return {
        status: 400,
        jsonBody: { error: 'Email is required' }
      };
    }

    const result = await authService.requestPasswordReset(email);

    return {
      status: 200,
      jsonBody: result
    };

  } catch (error: any) {
    context.log('Request password reset error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Password reset request failed' }
    };
  }
}

export async function authUpdateEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
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

    const body = await request.json() as any;
    const { newEmail, currentPassword } = body;

    if (!newEmail || !currentPassword) {
      return {
        status: 400,
        jsonBody: { error: 'New email and current password are required' }
      };
    }

    // Note: This would need to be implemented in the auth service
    // For now, returning a placeholder response
    return {
      status: 501,
      jsonBody: { error: 'Update email functionality not yet implemented in auth service' }
    };

  } catch (error: any) {
    context.log('Update email error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Email update failed' }
    };
  }
}

// Register HTTP triggers
app.http('authLogin', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: authLogin
});

app.http('authRegister', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: authRegister
});

app.http('authVerifyToken', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/verify_token',
  handler: authVerifyToken
});

app.http('authChangePassword', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'auth/update-password',
  handler: authChangePassword
});

app.http('authResetPassword', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/reset-password',
  handler: authResetPassword
});

app.http('authRequestPasswordReset', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/request-reset',
  handler: authRequestPasswordReset
});

app.http('authUpdateEmail', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'auth/update-email',
  handler: authUpdateEmail
}); 