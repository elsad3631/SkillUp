import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { trainingEnrollmentService } from '../services/training-enrollment.service';
import { verifyToken } from '../middlewares/auth';
import { authService } from '../services/auth.service';

// GET /api/training-enrollment - Get all training enrollments
export async function trainingEnrollmentGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const enrollments = await trainingEnrollmentService.getAll();

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get all training enrollments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollments' }
    };
  }
}

// GET /api/training-enrollment/{id} - Get training enrollment by ID
export async function trainingEnrollmentGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const enrollment = await trainingEnrollmentService.getById(id);

    if (!enrollment) {
      return {
        status: 404,
        jsonBody: { error: 'Training enrollment not found' }
      };
    }

    return {
      status: 200,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Get training enrollment by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollment' }
    };
  }
}

// GET /api/training-enrollment/user/{userId} - Get enrollments by user
export async function trainingEnrollmentGetByUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const enrollments = await trainingEnrollmentService.getByUserId(userId);

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get training enrollments by user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollments' }
    };
  }
}

// GET /api/training-enrollment/training/{trainingId} - Get enrollments by training
export async function trainingEnrollmentGetByTraining(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const trainingId = (context.triggerMetadata?.trainingId as string) || request.url.split('/').pop() || '';
    const enrollments = await trainingEnrollmentService.getByTrainingId(trainingId);

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get training enrollments by training error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollments' }
    };
  }
}

// GET /api/training-enrollment/status/{status} - Get enrollments by status
export async function trainingEnrollmentGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const enrollments = await trainingEnrollmentService.getByStatus(status);

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get training enrollments by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollments' }
    };
  }
}

// GET /api/training-enrollment/in-progress - Get in progress enrollments
export async function trainingEnrollmentGetInProgress(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const enrollments = await trainingEnrollmentService.getInProgressEnrollments();

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get in progress training enrollments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve in progress enrollments' }
    };
  }
}

// GET /api/training-enrollment/completed - Get completed enrollments
export async function trainingEnrollmentGetCompleted(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const enrollments = await trainingEnrollmentService.getCompletedEnrollments();

    return {
      status: 200,
      jsonBody: enrollments
    };

  } catch (error: any) {
    context.log('Get completed training enrollments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve completed enrollments' }
    };
  }
}

// POST /api/training-enrollment - Create new training enrollment
export async function trainingEnrollmentCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
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
        // Se l'utente corrente è super admin, il nuovo enrollment viene associato alla sua società
        companyId = currentUser.company || currentUser.id;
      } else {
        // Se l'utente corrente non è super admin, il nuovo enrollment viene associato alla società dell'utente corrente
        companyId = currentUser.company || undefined;
      }
    }

    // Add company to the enrollment data
    const enrollmentData = {
      ...body,
      company: companyId
    };

    const enrollment = await trainingEnrollmentService.create(enrollmentData);

    return {
      status: 201,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Create training enrollment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create training enrollment' }
    };
  }
}

// PUT /api/training-enrollment/{id} - Update training enrollment
export async function trainingEnrollmentUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
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
        // Se l'utente corrente è super admin, l'enrollment viene associato alla sua società
        companyId = currentUser.company || currentUser.id;
      } else {
        // Se l'utente corrente non è super admin, l'enrollment viene associato alla società dell'utente corrente
        companyId = currentUser.company || undefined;
      }
    }

    // Add company to the enrollment data
    const enrollmentData = {
      ...body,
      company: companyId
    };

    const enrollment = await trainingEnrollmentService.update(id, enrollmentData);

    return {
      status: 200,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Update training enrollment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update training enrollment' }
    };
  }
}

// DELETE /api/training-enrollment/{id} - Delete training enrollment
export async function trainingEnrollmentRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await trainingEnrollmentService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete training enrollment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete training enrollment' }
    };
  }
}

// POST /api/training-enrollment/{id}/progress - Update progress
export async function trainingEnrollmentUpdateProgress(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const progress = body.progress || 0;
    const enrollment = await trainingEnrollmentService.updateProgress(id, progress);

    return {
      status: 200,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Update training enrollment progress error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update training enrollment progress' }
    };
  }
}

// POST /api/training-enrollment/{id}/complete - Complete enrollment
export async function trainingEnrollmentComplete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const score = body.score;
    const certificateUrl = body.certificateUrl;
    const enrollment = await trainingEnrollmentService.completeEnrollment(id, score, certificateUrl);

    return {
      status: 200,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Complete training enrollment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to complete training enrollment' }
    };
  }
}

// POST /api/training-enrollment/{id}/cancel - Cancel enrollment
export async function trainingEnrollmentCancel(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const enrollment = await trainingEnrollmentService.cancelEnrollment(id);

    return {
      status: 200,
      jsonBody: enrollment
    };

  } catch (error: any) {
    context.log('Cancel training enrollment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to cancel training enrollment' }
    };
  }
}

// GET /api/training-enrollment/stats - Get enrollment stats
export async function trainingEnrollmentGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await trainingEnrollmentService.getEnrollmentStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get training enrollment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve enrollment stats' }
    };
  }
}

// GET /api/training-enrollment/stats/user/{userId} - Get user enrollment stats
export async function trainingEnrollmentGetUserStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const stats = await trainingEnrollmentService.getEnrollmentStatsByUser(userId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user training enrollment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user enrollment stats' }
    };
  }
}

// GET /api/training-enrollment/stats/training/{trainingId} - Get training enrollment stats
export async function trainingEnrollmentGetTrainingStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const trainingId = (context.triggerMetadata?.trainingId as string) || request.url.split('/').pop() || '';
    const stats = await trainingEnrollmentService.getEnrollmentStatsByTraining(trainingId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get training enrollment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve training enrollment stats' }
    };
  }
}

// Configure the routes
app.http('training-enrollment-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetAll,
  route: 'training-enrollment'
});

app.http('training-enrollment-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetById,
  route: 'training-enrollment/{id}'
});

app.http('training-enrollment-get-by-user', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetByUser,
  route: 'training-enrollment/user/{userId}'
});

app.http('training-enrollment-get-by-training', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetByTraining,
  route: 'training-enrollment/training/{trainingId}'
});

app.http('training-enrollment-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetByStatus,
  route: 'training-enrollment/status/{status}'
});

app.http('training-enrollment-get-in-progress', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetInProgress,
  route: 'training-enrollment/in-progress'
});

app.http('training-enrollment-get-completed', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetCompleted,
  route: 'training-enrollment/completed'
});

app.http('training-enrollment-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentCreate,
  route: 'training-enrollment'
});

app.http('training-enrollment-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentUpdate,
  route: 'training-enrollment/{id}'
});

app.http('training-enrollment-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentRemove,
  route: 'training-enrollment/{id}'
});

app.http('training-enrollment-update-progress', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentUpdateProgress,
  route: 'training-enrollment/{id}/progress'
});

app.http('training-enrollment-complete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentComplete,
  route: 'training-enrollment/{id}/complete'
});

app.http('training-enrollment-cancel', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentCancel,
  route: 'training-enrollment/{id}/cancel'
});

app.http('training-enrollment-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetStats,
  route: 'training-enrollment/stats'
});

app.http('training-enrollment-get-user-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetUserStats,
  route: 'training-enrollment/stats/user/{userId}'
});

app.http('training-enrollment-get-training-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: trainingEnrollmentGetTrainingStats,
  route: 'training-enrollment/stats/training/{trainingId}'
}); 