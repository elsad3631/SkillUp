import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { skillService } from '../services/skill.service';

export async function skillGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const skills = await skillService.getAllSkills();

    return {
      status: 200,
      jsonBody: skills
    };

  } catch (error: any) {
    context.log('Get all skills error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve skills' }
    };
  }
}

export async function skillGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Skill ID is required' }
      };
    }

    const skill = await skillService.getSkillById(id);

    return {
      status: 200,
      jsonBody: skill
    };

  } catch (error: any) {
    context.log('Get skill by ID error:', error);
    
    if (error.message === 'Skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Skill not found' }
      };
    }
    
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve skill' }
    };
  }
}

export async function skillCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;

    if (!body.name) {
      return {
        status: 400,
        jsonBody: { error: 'Skill name is required' }
      };
    }

    const skill = await skillService.createSkill(body);

    return {
      status: 201,
      jsonBody: skill
    };

  } catch (error: any) {
    context.log('Create skill error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create skill' }
    };
  }
}

export async function skillUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Skill ID is required' }
      };
    }

    const body = await request.json() as any;

    const skill = await skillService.updateSkill(id, body);

    return {
      status: 200,
      jsonBody: skill
    };

  } catch (error: any) {
    context.log('Update skill error:', error);
    
    if (error.message === 'Skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Skill not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update skill' }
    };
  }
}

export async function skillDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Skill ID is required' }
      };
    }

    await skillService.deleteSkill(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete skill error:', error);
    
    if (error.message === 'Skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Skill not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete skill' }
    };
  }
}

app.http('skillGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skills',
  handler: skillGetAll
});

app.http('skillGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
  handler: skillGetById
});

app.http('skillCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'skills',
  handler: skillCreate
});

app.http('skillUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
  handler: skillUpdate
});

app.http('skillDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'skills/{id}',
  handler: skillDelete
}); 