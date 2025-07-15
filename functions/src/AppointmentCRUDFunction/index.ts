import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { appointmentService } from '../services/appointment.service';

export async function appointmentGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const appointments = await appointmentService.getAllAppointments();

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

export async function appointmentGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Appointment ID is required' }
      };
    }

    const appointment = await appointmentService.getAppointmentById(id);

    return {
      status: 200,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Get appointment by ID error:', error);
    
    if (error.message === 'Appointment not found') {
      return {
        status: 404,
        jsonBody: { error: 'Appointment not found' }
      };
    }
    
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve appointment' }
    };
  }
}

export async function appointmentCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;

    if (!body.title || !body.startTime || !body.endTime) {
      return {
        status: 400,
        jsonBody: { error: 'Title, start time, and end time are required' }
      };
    }

    const appointment = await appointmentService.createAppointment(body);

    return {
      status: 201,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Create appointment error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create appointment' }
    };
  }
}

export async function appointmentUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Appointment ID is required' }
      };
    }

    const body = await request.json() as any;

    const appointment = await appointmentService.updateAppointment(id, body);

    return {
      status: 200,
      jsonBody: appointment
    };

  } catch (error: any) {
    context.log('Update appointment error:', error);
    
    if (error.message === 'Appointment not found') {
      return {
        status: 404,
        jsonBody: { error: 'Appointment not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update appointment' }
    };
  }
}

export async function appointmentDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = request.params.id;
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Appointment ID is required' }
      };
    }

    await appointmentService.deleteAppointment(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete appointment error:', error);
    
    if (error.message === 'Appointment not found') {
      return {
        status: 404,
        jsonBody: { error: 'Appointment not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete appointment' }
    };
  }
}

// Register HTTP triggers
app.http('appointmentGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'appointments',
  handler: appointmentGetAll
});

app.http('appointmentGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'appointments/{id}',
  handler: appointmentGetById
});

app.http('appointmentCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'appointments',
  handler: appointmentCreate
});

app.http('appointmentUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'appointments/{id}',
  handler: appointmentUpdate
});

app.http('appointmentDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'appointments/{id}',
  handler: appointmentDelete
}); 