import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { projectSkillService } from '../services/projectSkill.service';

export async function projectSkillGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectSkills = await projectSkillService.getAllProjectSkills();

    return {
      status: 200,
      jsonBody: projectSkills
    };

  } catch (error: any) {
    context.log('Get all project skills error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project skills' }
    };
  }
}

export async function projectSkillGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project skill ID is required' }
      };
    }

    const projectSkill = await projectSkillService.getProjectSkillById(id);

    return {
      status: 200,
      jsonBody: projectSkill
    };

  } catch (error: any) {
    context.log('Get project skill by ID error:', error);
    
    if (error.message === 'Project skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project skill not found' }
      };
    }
    
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project skill' }
    };
  }
}

export async function projectSkillCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project skill name is required' }
      };
    }

    const projectSkill = await projectSkillService.createProjectSkill(body);

    return {
      status: 201,
      jsonBody: projectSkill
    };

  } catch (error: any) {
    context.log('Create project skill error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create project skill' }
    };
  }
}

export async function projectSkillUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project skill ID is required' }
      };
    }

    const body = await request.json() as any;

    const projectSkill = await projectSkillService.updateProjectSkill(id, body);

    return {
      status: 200,
      jsonBody: projectSkill
    };

  } catch (error: any) {
    context.log('Update project skill error:', error);
    
    if (error.message === 'Project skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project skill not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update project skill' }
    };
  }
}

export async function projectSkillDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        jsonBody: { error: 'Project skill ID is required' }
      };
    }

    await projectSkillService.deleteProjectSkill(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete project skill error:', error);
    
    if (error.message === 'Project skill not found') {
      return {
        status: 404,
        jsonBody: { error: 'Project skill not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete project skill' }
    };
  }
}

export async function projectSkillGetByProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = request.params.projectId;
    if (!projectId) {
      return {
        status: 400,
        jsonBody: { error: 'Project ID is required' }
      };
    }

    const skills = await projectSkillService.getSkillsByProject(projectId);

    return {
      status: 200,
      jsonBody: skills
    };

  } catch (error: any) {
    context.log('Get skills by project error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve skills by project' }
    };
  }
}

// Register HTTP triggers
app.http('projectSkillGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills',
  handler: projectSkillGetAll
});

app.http('projectSkillGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: projectSkillGetById
});

app.http('projectSkillCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'project-skills',
  handler: projectSkillCreate
});

app.http('projectSkillUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: projectSkillUpdate
});

app.http('projectSkillDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'project-skills/{id}',
  handler: projectSkillDelete
});

app.http('projectSkillGetByProject', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'projects/{projectId}/skills',
  handler: projectSkillGetByProject
}); 