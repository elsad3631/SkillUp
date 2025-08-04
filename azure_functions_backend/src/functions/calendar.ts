import { HttpRequest, InvocationContext, HttpResponseInit, app } from '@azure/functions';
import { CalendarService, CreateCalendarEventDto, UpdateCalendarEventDto, CalendarEventFilter } from '../services/calendar.service';
import { authService } from '../services/auth.service';

const calendarService = new CalendarService();

// GET /api/calendar - Get all events or filtered events
export async function calendarGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization header required' }
      };
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    const url = new URL(request.url);
    const { searchParams } = url;
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const customerId = searchParams.get('customerId');
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const createdBy = searchParams.get('createdBy');

    let events;
    if (eventType) {
      events = await calendarService.getEventsByType(eventType);
    } else if (status) {
      events = await calendarService.getEventsByStatus(status);
    } else if (userId) {
      events = await calendarService.getEventsByUser(userId);
    } else if (customerId) {
      events = await calendarService.getEventsByCustomer(customerId);
    } else if (projectId) {
      events = await calendarService.getEventsByProject(projectId);
    } else if (startDate && endDate) {
      events = await calendarService.getEventsByDateRange(new Date(startDate), new Date(endDate));
    } else if (createdBy) {
      // Handle special case for "me"
      const actualCreatedBy = createdBy === 'me' ? (decoded as any).userId : createdBy;
      const filter: CalendarEventFilter = { createdBy: actualCreatedBy };
      events = await calendarService.getEventsByFilter(filter);
    } else {
      events = await calendarService.getAllEvents();
    }

    return {
      status: 200,
      jsonBody: events
    };

  } catch (error: any) {
    context.log('Get all events error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve events' }
    };
  }
}

// GET /api/calendar/{id} - Get event by ID
export async function calendarGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const event = await calendarService.getEventById(id);

    if (!event) {
      return {
        status: 404,
        jsonBody: { error: 'Event not found' }
      };
    }

    return {
      status: 200,
      jsonBody: event
    };

  } catch (error: any) {
    context.log('Get event by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve event' }
    };
  }
}

// POST /api/calendar - Create new event
export async function calendarCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization header required' }
      };
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    const body = await request.json() as CreateCalendarEventDto;
    
    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate || !body.eventType) {
      return {
        status: 400,
        jsonBody: { error: 'Title, startDate, endDate, and eventType are required' }
      };
    }

    // Set createdBy to current user if not provided
    if (!body.createdBy) {
      body.createdBy = (decoded as any).userId;
    }

    // Validate dates
    if (new Date(body.startDate) >= new Date(body.endDate)) {
      return {
        status: 400,
        jsonBody: { error: 'End date must be after start date' }
      };
    }

    const newEvent = await calendarService.createEvent(body);
    return {
      status: 201,
      jsonBody: newEvent
    };

  } catch (error: any) {
    context.log('Create event error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create event' }
    };
  }
}

// PUT /api/calendar/{id} - Update event
export async function calendarUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization header required' }
      };
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Event ID is required' }
      };
    }

    const body = await request.json() as UpdateCalendarEventDto;
    
    // Validate dates if provided
    if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
      return {
        status: 400,
        jsonBody: { error: 'End date must be after start date' }
      };
    }

    const updatedEvent = await calendarService.updateEvent(id, body);
    
    return {
      status: 200,
      jsonBody: updatedEvent
    };

  } catch (error: any) {
    context.log('Update event error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update event' }
    };
  }
}

// DELETE /api/calendar/{id} - Delete event
export async function calendarDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization header required' }
      };
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Event ID is required' }
      };
    }

    await calendarService.deleteEvent(id);
    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete event error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete event' }
    };
  }
}

// GET /api/calendar/upcoming - Get upcoming events
export async function calendarGetUpcoming(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const url = new URL(request.url);
    const { searchParams } = url;
    const days = parseInt(searchParams.get('days') || '7');

    const events = await calendarService.getUpcomingEvents(days);
    return {
      status: 200,
      jsonBody: events
    };

  } catch (error: any) {
    context.log('Get upcoming events error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve upcoming events' }
    };
  }
}

// GET /api/calendar/today - Get today's events
export async function calendarGetToday(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const events = await calendarService.getTodayEvents();
    return {
      status: 200,
      jsonBody: events
    };

  } catch (error: any) {
    context.log('Get today events error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve today events' }
    };
  }
}

// HTTP Trigger Registrations
app.http('calendarGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'calendar',
  handler: calendarGetAll
});

app.http('calendarGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'calendar/{id}',
  handler: calendarGetById
});

app.http('calendarCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'calendar',
  handler: calendarCreate
});

app.http('calendarUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'calendar/{id}',
  handler: calendarUpdate
});

app.http('calendarDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'calendar/{id}',
  handler: calendarDelete
});

app.http('calendarGetUpcoming', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'calendar/upcoming',
  handler: calendarGetUpcoming
});

app.http('calendarGetToday', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'calendar/today',
  handler: calendarGetToday
}); 