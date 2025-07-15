import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { skillTrainingService } from '../services/skillTraining.service';

export async function skillTrainingGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const trainings = await skillTrainingService.getAllSkillTrainings();
    return { status: 200, jsonBody: trainings };

  } catch (error: any) {
    context.log('Get all skill trainings error:', error);
    return { status: 500, jsonBody: { error: error.message || 'Failed to retrieve skill trainings' } };
  }
}

export async function skillTrainingGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Skill training ID is required' } };
    }

    const training = await skillTrainingService.getSkillTrainingById(id);
    return { status: 200, jsonBody: training };

  } catch (error: any) {
    context.log('Get skill training by ID error:', error);
    
    if (error.message === 'Skill training not found') {
      return { status: 404, jsonBody: { error: 'Skill training not found' } };
    }
    
    return { status: 500, jsonBody: { error: error.message || 'Failed to retrieve skill training' } };
  }
}

export async function skillTrainingCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const body = await request.json() as any;

    if (!body.title || !body.estimatedDurationHours) {
      return { status: 400, jsonBody: { error: 'Title and estimated duration hours are required' } };
    }

    const training = await skillTrainingService.createSkillTraining(body);
    return { status: 201, jsonBody: training };

  } catch (error: any) {
    context.log('Create skill training error:', error);
    return { status: 400, jsonBody: { error: error.message || 'Failed to create skill training' } };
  }
}

export async function skillTrainingUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Skill training ID is required' } };
    }

    const body = await request.json() as any;

    const training = await skillTrainingService.updateSkillTraining(id, body);
    return { status: 200, jsonBody: training };

  } catch (error: any) {
    context.log('Update skill training error:', error);
    
    if (error.message === 'Skill training not found') {
      return { status: 404, jsonBody: { error: 'Skill training not found' } };
    }
    
    return { status: 400, jsonBody: { error: error.message || 'Failed to update skill training' } };
  }
}

export async function skillTrainingDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return { status: 405, jsonBody: { error: 'Method not allowed' } };
    }

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: 'Skill training ID is required' } };
    }

    await skillTrainingService.deleteSkillTraining(id);
    return { status: 204, body: '' };

  } catch (error: any) {
    context.log('Delete skill training error:', error);
    
    if (error.message === 'Skill training not found') {
      return { status: 404, jsonBody: { error: 'Skill training not found' } };
    }
    
    return { status: 400, jsonBody: { error: error.message || 'Failed to delete skill training' } };
  }
}

// Register HTTP triggers
app.http('skillTrainingGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skill-trainings',
  handler: skillTrainingGetAll
});

app.http('skillTrainingGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: skillTrainingGetById
});

app.http('skillTrainingCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'skill-trainings',
  handler: skillTrainingCreate
});

app.http('skillTrainingUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: skillTrainingUpdate
});

app.http('skillTrainingDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'skill-trainings/{id}',
  handler: skillTrainingDelete
}); 