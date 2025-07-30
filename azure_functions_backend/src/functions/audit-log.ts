import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { auditLogService } from '../services/audit-log.service';

// GET /api/audit-log - Get all audit logs
export async function auditLogGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const auditLogs = await auditLogService.getAll();

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get all audit logs error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit logs' }
    };
  }
}

// GET /api/audit-log/{id} - Get audit log by ID
export async function auditLogGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const auditLog = await auditLogService.getById(id);

    if (!auditLog) {
      return {
        status: 404,
        jsonBody: { error: 'Audit log not found' }
      };
    }

    return {
      status: 200,
      jsonBody: auditLog
    };

  } catch (error: any) {
    context.log('Get audit log by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit log' }
    };
  }
}

// GET /api/audit-log/user/{userId} - Get audit logs by user
export async function auditLogGetByUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const auditLogs = await auditLogService.getByUserId(userId);

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get audit logs by user error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit logs' }
    };
  }
}

// GET /api/audit-log/action/{action} - Get audit logs by action
export async function auditLogGetByAction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const action = (context.triggerMetadata?.action as string) || request.url.split('/').pop() || '';
    const auditLogs = await auditLogService.getByAction(action);

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get audit logs by action error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit logs' }
    };
  }
}

// GET /api/audit-log/entity/{entityType}/{entityId} - Get audit logs by entity
export async function auditLogGetByEntity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const urlParts = request.url.split('/');
    const entityType = urlParts[urlParts.length - 2];
    const entityId = urlParts[urlParts.length - 1];
    const auditLogs = await auditLogService.getByEntity(entityType, entityId);

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get audit logs by entity error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit logs' }
    };
  }
}

// GET /api/audit-log/date-range - Get audit logs by date range
export async function auditLogGetByDateRange(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    if (!startDate || !endDate) {
      return {
        status: 400,
        jsonBody: { error: 'Start date and end date are required' }
      };
    }

    const auditLogs = await auditLogService.getByDateRange(new Date(startDate), new Date(endDate));

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get audit logs by date range error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit logs' }
    };
  }
}

// GET /api/audit-log/recent - Get recent audit logs
export async function auditLogGetRecent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const days = parseInt(request.url.split('?days=')[1] || '7');
    const auditLogs = await auditLogService.getRecentLogs(days);

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get recent audit logs error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve recent audit logs' }
    };
  }
}

// GET /api/audit-log/critical - Get critical audit logs
export async function auditLogGetCritical(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const auditLogs = await auditLogService.getCriticalLogs();

    return {
      status: 200,
      jsonBody: auditLogs
    };

  } catch (error: any) {
    context.log('Get critical audit logs error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve critical audit logs' }
    };
  }
}

// POST /api/audit-log - Create new audit log
export async function auditLogCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const auditLog = await auditLogService.create(body);

    return {
      status: 201,
      jsonBody: auditLog
    };

  } catch (error: any) {
    context.log('Create audit log error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create audit log' }
    };
  }
}

// DELETE /api/audit-log/{id} - Delete audit log
export async function auditLogRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await auditLogService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete audit log error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete audit log' }
    };
  }
}

// POST /api/audit-log/export - Export audit logs
export async function auditLogExport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;
    const { startDate, endDate, format = 'csv' } = body;
    
    if (!startDate || !endDate) {
      return {
        status: 400,
        jsonBody: { error: 'Start date and end date are required' }
      };
    }

    const exportData = await auditLogService.exportLogs(new Date(startDate), new Date(endDate), format);

    return {
      status: 200,
      jsonBody: exportData
    };

  } catch (error: any) {
    context.log('Export audit logs error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to export audit logs' }
    };
  }
}

// GET /api/audit-log/stats - Get audit log stats
export async function auditLogGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await auditLogService.getAuditStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get audit log stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve audit log stats' }
    };
  }
}

// GET /api/audit-log/stats/user/{userId} - Get user audit log stats
export async function auditLogGetUserStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const stats = await auditLogService.getAuditStatsByUser(userId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user audit log stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user audit log stats' }
    };
  }
}

// GET /api/audit-log/stats/action/{action} - Get action audit log stats
export async function auditLogGetActionStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const action = (context.triggerMetadata?.action as string) || request.url.split('/').pop() || '';
    const stats = await auditLogService.getAuditStatsByAction(action);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get action audit log stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve action audit log stats' }
    };
  }
}

// Configure the routes
app.http('audit-log-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetAll,
  route: 'audit-log'
});

app.http('audit-log-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetById,
  route: 'audit-log/{id}'
});

app.http('audit-log-get-by-user', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetByUser,
  route: 'audit-log/user/{userId}'
});

app.http('audit-log-get-by-action', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetByAction,
  route: 'audit-log/action/{action}'
});

app.http('audit-log-get-by-entity', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetByEntity,
  route: 'audit-log/entity/{entityType}/{entityId}'
});

app.http('audit-log-get-by-date-range', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetByDateRange,
  route: 'audit-log/date-range'
});

app.http('audit-log-get-recent', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetRecent,
  route: 'audit-log/recent'
});

app.http('audit-log-get-critical', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetCritical,
  route: 'audit-log/critical'
});

app.http('audit-log-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: auditLogCreate,
  route: 'audit-log'
});

app.http('audit-log-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: auditLogRemove,
  route: 'audit-log/{id}'
});

app.http('audit-log-export', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: auditLogExport,
  route: 'audit-log/export'
});

app.http('audit-log-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetStats,
  route: 'audit-log/stats'
});

app.http('audit-log-get-user-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetUserStats,
  route: 'audit-log/stats/user/{userId}'
});

app.http('audit-log-get-action-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: auditLogGetActionStats,
  route: 'audit-log/stats/action/{action}'
}); 