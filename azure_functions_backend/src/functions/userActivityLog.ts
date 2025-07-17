import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { userActivityLogService } from '../services/userActivityLog.service';

// GET /api/userActivityLog - Get all logs
app.http('getAllLogs', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const logs = await userActivityLogService.getAll();
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getAllLogs:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/:id - Get log by ID
app.http('getLogById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];

      const log = await userActivityLogService.getById(id);
      if (!log) {
        return {
          status: 404,
          body: JSON.stringify({ error: 'Log not found' }),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }
      return {
        status: 200,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogById:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/user/:userId - Get logs by user ID
app.http('getLogsByUser', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/user/{userId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const userId = pathSegments[pathSegments.indexOf('user') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const logs = await userActivityLogService.getByUserId(userId, limit);
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogsByUser:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/action/:action - Get logs by action
app.http('getLogsByAction', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/action/{action}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const action = pathSegments[pathSegments.indexOf('action') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const logs = await userActivityLogService.getByAction(action, limit);
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogsByAction:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/entity/:entityType - Get logs by entity type
app.http('getLogsByEntityType', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/entity/{entityType}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const entityType = pathSegments[pathSegments.indexOf('entity') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const logs = await userActivityLogService.getByEntityType(entityType, limit);
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogsByEntityType:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/status/:status - Get logs by status
app.http('getLogsByStatus', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/status/{status}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const status = pathSegments[pathSegments.indexOf('status') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const logs = await userActivityLogService.getByStatus(status, limit);
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogsByStatus:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/date-range - Get logs by date range
app.http('getLogsByDateRange', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/date-range',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      if (!startDate || !endDate) {
        return {
          status: 400,
          body: JSON.stringify({ error: 'startDate and endDate are required' }),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      const logs = await userActivityLogService.getByDateRange(
        new Date(startDate),
        new Date(endDate),
        limit
      );
      return {
        status: 200,
        body: JSON.stringify(logs),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogsByDateRange:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// GET /api/userActivityLog/stats - Get log statistics
app.http('getLogStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'userActivityLog/stats',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const stats = await userActivityLogService.getStats();
      return {
        status: 200,
        body: JSON.stringify(stats),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getLogStats:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// POST /api/userActivityLog - Create new log
app.http('createLog', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'userActivityLog',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const log = await userActivityLogService.create(body);
      return {
        status: 201,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in createLog:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// POST /api/userActivityLog/success - Log success action
app.http('logSuccessAction', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'userActivityLog/success',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const log = await userActivityLogService.logSuccess(body);
      return {
        status: 201,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in logSuccessAction:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// POST /api/userActivityLog/error - Log error action
app.http('logErrorAction', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'userActivityLog/error',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const log = await userActivityLogService.logError(body);
      return {
        status: 201,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in logErrorAction:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// POST /api/userActivityLog/pending - Log pending action
app.http('logPendingAction', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'userActivityLog/pending',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const log = await userActivityLogService.logPending(body);
      return {
        status: 201,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in logPendingAction:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// PUT /api/userActivityLog/:id - Update log
app.http('updateLog', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'userActivityLog/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];
      const body = await request.json() as any;

      const log = await userActivityLogService.update(id, body);
      return {
        status: 200,
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in updateLog:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// DELETE /api/userActivityLog/:id - Delete log
app.http('deleteLog', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'userActivityLog/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];

      await userActivityLogService.remove(id);
      return {
        status: 204,
      };
    } catch (error) {
      context.error('Error in deleteLog:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
});

// DELETE /api/userActivityLog/cleanup/:daysOld - Remove old logs
app.http('removeOldLogs', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'userActivityLog/cleanup/{daysOld}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const daysOld = parseInt(pathSegments[pathSegments.indexOf('cleanup') + 1]);
      
      if (isNaN(daysOld)) {
        return {
          status: 400,
          body: JSON.stringify({ error: 'Invalid days parameter' }),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }
      
      const result = await userActivityLogService.removeOldLogs(daysOld);
      return {
        status: 200,
        body: JSON.stringify({ deletedCount: result.count }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in removeOldLogs:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
}); 