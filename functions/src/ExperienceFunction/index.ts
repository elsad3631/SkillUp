import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { experienceService } from '../services/experience.service';

export async function experienceGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const experiences = await experienceService.getAllExperiences();
    return { status: 200, jsonBody: experiences };

  } catch (error: any) {
    context.log('Get all experiences error:', error);
    return { status: 500, jsonBody: { error: error.message || 'Failed to retrieve experiences' } };
  }
}

export async function experienceGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Experience ID is required' } };
    }

    const experience = await experienceService.getExperienceById(id);
    return { status: 200, jsonBody: experience };

  } catch (error: any) {
    context.log('Get experience by ID error:', error);
    
    if (error.message === 'Experience not found') {
      return { status: 404, jsonBody: { error: 'Experience not found' } };
    }
    
    return { status: 500, jsonBody: { error: error.message || 'Failed to retrieve experience' } };
  }
}

export async function experienceCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const body = await request.json() as any;

    if (!body.jobTitle || !body.companyName || !body.startDate || !body.applicationUserId) {
      return { status: 400, jsonBody: { error: 'Job title, company name, start date, and user ID are required' } };
    }

    const experience = await experienceService.createExperience(body);
    return { status: 201, jsonBody: experience };

  } catch (error: any) {
    context.log('Create experience error:', error);
    return { status: 400, jsonBody: { error: error.message || 'Failed to create experience' } };
  }
}

export async function experienceUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Experience ID is required' } };
    }

    const body = await request.json() as any;

    const experience = await experienceService.updateExperience(id, body);
    return { status: 200, jsonBody: experience };

  } catch (error: any) {
    context.log('Update experience error:', error);
    
    if (error.message === 'Experience not found') {
      return { status: 404, jsonBody: { error: 'Experience not found' } };
    }
    
    return { status: 400, jsonBody: { error: error.message || 'Failed to update experience' } };
  }
}

export async function experienceDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Experience ID is required' } };
    }

    await experienceService.deleteExperience(id);
    return { status: 204, body: '' };

  } catch (error: any) {
    context.log('Delete experience error:', error);
    
    if (error.message === 'Experience not found') {
      return { status: 404, jsonBody: { error: 'Experience not found' } };
    }
    
    return { status: 400, jsonBody: { error: error.message || 'Failed to delete experience' } };
  }
}

// Register HTTP triggers
app.http('experienceGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'experiences',
  handler: experienceGetAll
});

app.http('experienceGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: experienceGetById
});

app.http('experienceCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'experiences',
  handler: experienceCreate
});

app.http('experienceUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: experienceUpdate
});

app.http('experienceDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'experiences/{id}',
  handler: experienceDelete
}); 