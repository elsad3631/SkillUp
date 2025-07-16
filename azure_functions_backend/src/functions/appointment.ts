import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { appointmentService } from '../services/appointment.service';

// GET /api/appointment - Get all appointments
export async function appointmentGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const appointments = await appointmentService.getAll();

    return {
      status: 200,
      jsonBody: appointments
    };

  } catch (error: any) {
    context.log('Get all appointments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve appointments' }
    };
  }
}

// GET /api/appointment/{id} - Get appointment by ID
export async function appointmentGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const appointment = await appointmentService.getById(id);

    if (!appointment) {
      return {
        status: 404,
        jsonBody: { error: 'Not found' }
      };
    }

    return {
      status: 200,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Get appointment by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve appointment' }
    };
  }
}

// POST /api/appointment - Create new appointment
export async function appointmentCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const appointment = await appointmentService.create(body);

    return {
      status: 201,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Create appointment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create appointment' }
    };
  }
}

// PUT /api/appointment/{id} - Update appointment
export async function appointmentUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const appointment = await appointmentService.update(id, body);

    return {
      status: 200,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Update appointment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update appointment' }
    };
  }
}

// DELETE /api/appointment/{id} - Remove appointment
export async function appointmentRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await appointmentService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Remove appointment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to remove appointment' }
    };
  }
}

// Register all routes
app.http('appointmentGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'appointment',
  handler: appointmentGetAll
});

app.http('appointmentGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'appointment/{id}',
  handler: appointmentGetById
});

app.http('appointmentCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'appointment',
  handler: appointmentCreate
});

app.http('appointmentUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'appointment/{id}',
  handler: appointmentUpdate
});

app.http('appointmentRemove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'appointment/{id}',
  handler: appointmentRemove
}); 