import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { notificationService } from '../services/notification.service';

// GET /api/notification - Get all notifications
app.http('getAllNotifications', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const notifications = await notificationService.getAll();
      return {
        status: 200,
        body: JSON.stringify(notifications),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getAllNotifications:', error);
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

// GET /api/notification/:id - Get notification by ID
app.http('getNotificationById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];

      const notification = await notificationService.getById(id);
      if (!notification) {
        return {
          status: 404,
          body: JSON.stringify({ error: 'Notification not found' }),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }
      return {
        status: 200,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getNotificationById:', error);
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

// GET /api/notification/recipient/:recipientId - Get notifications by recipient ID
app.http('getNotificationsByRecipient', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/recipient/{recipientId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const recipientId = pathSegments[pathSegments.indexOf('recipient') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const notifications = await notificationService.getByRecipientId(recipientId, limit);
      return {
        status: 200,
        body: JSON.stringify(notifications),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getNotificationsByRecipient:', error);
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

// GET /api/notification/unread/:recipientId - Get unread notifications by recipient ID
app.http('getUnreadNotificationsByRecipient', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/unread/{recipientId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const recipientId = pathSegments[pathSegments.indexOf('unread') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const notifications = await notificationService.getUnreadByRecipientId(recipientId, limit);
      return {
        status: 200,
        body: JSON.stringify(notifications),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getUnreadNotificationsByRecipient:', error);
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

// GET /api/notification/type/:type - Get notifications by type
app.http('getNotificationsByType', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/type/{type}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const type = pathSegments[pathSegments.indexOf('type') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const notifications = await notificationService.getByType(type, limit);
      return {
        status: 200,
        body: JSON.stringify(notifications),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getNotificationsByType:', error);
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

// GET /api/notification/priority/:priority - Get notifications by priority
app.http('getNotificationsByPriority', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/priority/{priority}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const priority = pathSegments[pathSegments.indexOf('priority') + 1];
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

      const notifications = await notificationService.getByPriority(priority, limit);
      return {
        status: 200,
        body: JSON.stringify(notifications),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getNotificationsByPriority:', error);
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

// GET /api/notification/unread-count/:recipientId - Get unread count
app.http('getUnreadNotificationCount', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/unread-count/{recipientId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const recipientId = pathSegments[pathSegments.indexOf('unread-count') + 1];

      const count = await notificationService.getUnreadCount(recipientId);
      return {
        status: 200,
        body: JSON.stringify({ count }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getUnreadNotificationCount:', error);
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

// GET /api/notification/stats - Get notification statistics
app.http('getNotificationStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notification/stats',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const stats = await notificationService.getStats();
      return {
        status: 200,
        body: JSON.stringify(stats),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in getNotificationStats:', error);
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

// POST /api/notification - Create new notification
app.http('createNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const notification = await notificationService.create(body);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in createNotification:', error);
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

// POST /api/notification/message - Send message notification
app.http('sendMessageNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification/message',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const notification = await notificationService.sendMessage(body);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in sendMessageNotification:', error);
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

// POST /api/notification/system - Send system notification
app.http('sendSystemNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification/system',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const notification = await notificationService.sendSystemNotification(body);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in sendSystemNotification:', error);
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

// POST /api/notification/cv-processing-complete - Send CV processing complete notification
app.http('sendCVProcessingCompleteNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification/cv-processing-complete',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const { recipientId, cvData } = body;
      const notification = await notificationService.sendCVProcessingComplete(recipientId, cvData);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in sendCVProcessingCompleteNotification:', error);
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

// POST /api/notification/project-assignment - Send project assignment notification
app.http('sendProjectAssignmentNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification/project-assignment',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const { recipientId, projectData } = body;
      const notification = await notificationService.sendProjectAssignment(recipientId, projectData);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in sendProjectAssignmentNotification:', error);
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

// POST /api/notification/task-completion - Send task completion notification
app.http('sendTaskCompletionNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'notification/task-completion',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await request.json() as any;
      const { recipientId, taskData } = body;
      const notification = await notificationService.sendTaskCompletion(recipientId, taskData);
      return {
        status: 201,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in sendTaskCompletionNotification:', error);
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

// PUT /api/notification/:id - Update notification
app.http('updateNotification', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'notification/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];
      const body = await request.json() as any;

      const notification = await notificationService.update(id, body);
      return {
        status: 200,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in updateNotification:', error);
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

// PUT /api/notification/mark-read/:id - Mark notification as read
app.http('markNotificationAsRead', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'notification/mark-read/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const notificationId = pathSegments[pathSegments.indexOf('mark-read') + 1];

      const notification = await notificationService.markAsRead(notificationId);
      return {
        status: 200,
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in markNotificationAsRead:', error);
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

// PUT /api/notification/mark-all-read/:recipientId - Mark all notifications as read
app.http('markAllNotificationsAsRead', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'notification/mark-all-read/{recipientId}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const recipientId = pathSegments[pathSegments.indexOf('mark-all-read') + 1];

      const result = await notificationService.markAllAsRead(recipientId);
      return {
        status: 200,
        body: JSON.stringify({ updatedCount: result.count }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in markAllNotificationsAsRead:', error);
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

// DELETE /api/notification/:id - Delete notification
app.http('deleteNotification', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'notification/{id}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];

      await notificationService.remove(id);
      return {
        status: 204,
      };
    } catch (error) {
      context.error('Error in deleteNotification:', error);
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

// DELETE /api/notification/cleanup/expired - Remove expired notifications
app.http('removeExpiredNotifications', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'notification/cleanup/expired',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const result = await notificationService.removeExpired();
      return {
        status: 200,
        body: JSON.stringify({ deletedCount: result.count }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      context.error('Error in removeExpiredNotifications:', error);
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