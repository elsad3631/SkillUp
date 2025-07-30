import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { certificationService } from '../services/certification.service';

// GET /api/certification - Get all certifications
export async function certificationGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const certifications = await certificationService.getAll();

    return {
      status: 200,
      jsonBody: certifications
    };

  } catch (error: any) {
    context.log('Get all certifications error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve certifications' }
    };
  }
}

// GET /api/certification/{id} - Get certification by ID
export async function certificationGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const certification = await certificationService.getById(id);

    if (!certification) {
      return {
        status: 404,
        jsonBody: { error: 'Certification not found' }
      };
    }

    return {
      status: 200,
      jsonBody: certification
    };

  } catch (error: any) {
    context.log('Get certification by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve certification' }
    };
  }
}

// GET /api/certification/user/{userId} - Get certifications by user
export async function certificationGetByUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const certifications = await certificationService.getByUserId(userId);

    return {
      status: 200,
      jsonBody: certifications
    };

  } catch (error: any) {
    context.log('Get certifications by user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve certifications' }
    };
  }
}

// GET /api/certification/status/{status} - Get certifications by status
export async function certificationGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const certifications = await certificationService.getByStatus(status);

    return {
      status: 200,
      jsonBody: certifications
    };

  } catch (error: any) {
    context.log('Get certifications by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve certifications' }
    };
  }
}

// GET /api/certification/expiring - Get expiring certifications
export async function certificationGetExpiring(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const days = parseInt(request.url.split('?days=')[1] || '30');
    const certifications = await certificationService.getExpiringCertifications(days);

    return {
      status: 200,
      jsonBody: certifications
    };

  } catch (error: any) {
    context.log('Get expiring certifications error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve expiring certifications' }
    };
  }
}

// GET /api/certification/expired - Get expired certifications
export async function certificationGetExpired(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const certifications = await certificationService.getExpiredCertifications();

    return {
      status: 200,
      jsonBody: certifications
    };

  } catch (error: any) {
    context.log('Get expired certifications error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve expired certifications' }
    };
  }
}

// POST /api/certification - Create new certification
export async function certificationCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const certification = await certificationService.create(body);

    return {
      status: 201,
      jsonBody: certification
    };

  } catch (error: any) {
    context.log('Create certification error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create certification' }
    };
  }
}

// PUT /api/certification/{id} - Update certification
export async function certificationUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const certification = await certificationService.update(id, body);

    return {
      status: 200,
      jsonBody: certification
    };

  } catch (error: any) {
    context.log('Update certification error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update certification' }
    };
  }
}

// DELETE /api/certification/{id} - Delete certification
export async function certificationRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await certificationService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete certification error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete certification' }
    };
  }
}

// POST /api/certification/{id}/renew - Renew certification
export async function certificationRenew(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const newExpiryDate = body.expiryDate;
    const certification = await certificationService.renewCertification(id, newExpiryDate);

    return {
      status: 200,
      jsonBody: certification
    };

  } catch (error: any) {
    context.log('Renew certification error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to renew certification' }
    };
  }
}

// POST /api/certification/{id}/verify - Verify certification
export async function certificationVerify(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const verificationDate = body.verificationDate;
    const verifiedBy = body.verifiedBy;
    const certification = await certificationService.verifyCertification(id, verificationDate, verifiedBy);

    return {
      status: 200,
      jsonBody: certification
    };

  } catch (error: any) {
    context.log('Verify certification error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to verify certification' }
    };
  }
}

// GET /api/certification/stats - Get certification stats
export async function certificationGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await certificationService.getCertificationStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get certification stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve certification stats' }
    };
  }
}

// GET /api/certification/stats/user/{userId} - Get user certification stats
export async function certificationGetUserStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const stats = await certificationService.getCertificationStatsByUser(userId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user certification stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user certification stats' }
    };
  }
}

// Configure the routes
app.http('certification-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetAll,
  route: 'certification'
});

app.http('certification-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetById,
  route: 'certification/{id}'
});

app.http('certification-get-by-user', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetByUser,
  route: 'certification/user/{userId}'
});

app.http('certification-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetByStatus,
  route: 'certification/status/{status}'
});

app.http('certification-get-expiring', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetExpiring,
  route: 'certification/expiring'
});

app.http('certification-get-expired', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetExpired,
  route: 'certification/expired'
});

app.http('certification-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: certificationCreate,
  route: 'certification'
});

app.http('certification-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: certificationUpdate,
  route: 'certification/{id}'
});

app.http('certification-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: certificationRemove,
  route: 'certification/{id}'
});

app.http('certification-renew', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: certificationRenew,
  route: 'certification/{id}/renew'
});

app.http('certification-verify', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: certificationVerify,
  route: 'certification/{id}/verify'
});

app.http('certification-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetStats,
  route: 'certification/stats'
});

app.http('certification-get-user-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: certificationGetUserStats,
  route: 'certification/stats/user/{userId}'
}); 