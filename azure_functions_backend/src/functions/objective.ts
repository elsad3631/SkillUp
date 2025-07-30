import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { objectiveService } from '../services/objective.service';

// GET /api/objective - Get all objectives
export async function objectiveGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const objectives = await objectiveService.getAll();

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get all objectives error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives' }
    };
  }
}

// GET /api/objective/{id} - Get objective by ID
export async function objectiveGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const objective = await objectiveService.getById(id);

    if (!objective) {
      return {
        status: 404,
        jsonBody: { error: 'Objective not found' }
      };
    }

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Get objective by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objective' }
    };
  }
}

// GET /api/objective/assigned/{userId} - Get objectives assigned to user
export async function objectiveGetByAssignedTo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const objectives = await objectiveService.getByAssignedTo(userId);

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get objectives by assigned to error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives' }
    };
  }
}

// GET /api/objective/project/{projectId} - Get objectives by project
export async function objectiveGetByProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const objectives = await objectiveService.getByProjectId(projectId);

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get objectives by project error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives' }
    };
  }
}

// GET /api/objective/status/{status} - Get objectives by status
export async function objectiveGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const objectives = await objectiveService.getByStatus(status);

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get objectives by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives' }
    };
  }
}

// GET /api/objective/priority/{priority} - Get objectives by priority
export async function objectiveGetByPriority(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const priority = (context.triggerMetadata?.priority as string) || request.url.split('/').pop() || '';
    const objectives = await objectiveService.getByPriority(priority);

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get objectives by priority error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives' }
    };
  }
}

// GET /api/objective/overdue - Get overdue objectives
export async function objectiveGetOverdue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const objectives = await objectiveService.getOverdueObjectives();

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get overdue objectives error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve overdue objectives' }
    };
  }
}

// GET /api/objective/due-soon - Get objectives due soon
export async function objectiveGetDueSoon(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const days = parseInt(request.url.split('?days=')[1] || '7');
    const objectives = await objectiveService.getObjectivesDueSoon(days);

    return {
      status: 200,
      jsonBody: objectives
    };

  } catch (error: any) {
    context.log('Get objectives due soon error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objectives due soon' }
    };
  }
}

// POST /api/objective - Create new objective
export async function objectiveCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const objective = await objectiveService.create(body);

    return {
      status: 201,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Create objective error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create objective' }
    };
  }
}

// PUT /api/objective/{id} - Update objective
export async function objectiveUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const objective = await objectiveService.update(id, body);

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Update objective error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update objective' }
    };
  }
}

// DELETE /api/objective/{id} - Delete objective
export async function objectiveRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await objectiveService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete objective error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete objective' }
    };
  }
}

// POST /api/objective/{id}/assign - Assign objective to user
export async function objectiveAssign(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const assignedTo = body.assignedTo;
    const objective = await objectiveService.assignObjective(id, assignedTo);

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Assign objective error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to assign objective' }
    };
  }
}

// POST /api/objective/{id}/status - Update objective status
export async function objectiveUpdateStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const status = body.status;
    const objective = await objectiveService.updateStatus(id, status);

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Update objective status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update objective status' }
    };
  }
}

// POST /api/objective/{id}/progress - Update objective progress
export async function objectiveUpdateProgress(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const progress = body.progress || 0;
    const objective = await objectiveService.updateProgress(id, progress);

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Update objective progress error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update objective progress' }
    };
  }
}

// POST /api/objective/{id}/complete - Complete objective
export async function objectiveComplete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const completionNotes = body.completionNotes;
    const objective = await objectiveService.completeObjective(id, completionNotes);

    return {
      status: 200,
      jsonBody: objective
    };

  } catch (error: any) {
    context.log('Complete objective error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to complete objective' }
    };
  }
}

// GET /api/objective/stats - Get objective stats
export async function objectiveGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await objectiveService.getObjectiveStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get objective stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve objective stats' }
    };
  }
}

// GET /api/objective/stats/user/{userId} - Get user objective stats
export async function objectiveGetUserStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const stats = await objectiveService.getObjectiveStatsByUser(userId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user objective stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user objective stats' }
    };
  }
}

// GET /api/objective/stats/project/{projectId} - Get project objective stats
export async function objectiveGetProjectStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const stats = await objectiveService.getObjectiveStatsByProject(projectId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get project objective stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project objective stats' }
    };
  }
}

// Configure the routes
app.http('objective-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetAll,
  route: 'objective'
});

app.http('objective-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetById,
  route: 'objective/{id}'
});

app.http('objective-get-by-assigned-to', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetByAssignedTo,
  route: 'objective/assigned/{userId}'
});

app.http('objective-get-by-project', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetByProject,
  route: 'objective/project/{projectId}'
});

app.http('objective-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetByStatus,
  route: 'objective/status/{status}'
});

app.http('objective-get-by-priority', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetByPriority,
  route: 'objective/priority/{priority}'
});

app.http('objective-get-overdue', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetOverdue,
  route: 'objective/overdue'
});

app.http('objective-get-due-soon', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetDueSoon,
  route: 'objective/due-soon'
});

app.http('objective-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: objectiveCreate,
  route: 'objective'
});

app.http('objective-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: objectiveUpdate,
  route: 'objective/{id}'
});

app.http('objective-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: objectiveRemove,
  route: 'objective/{id}'
});

app.http('objective-assign', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: objectiveAssign,
  route: 'objective/{id}/assign'
});

app.http('objective-update-status', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: objectiveUpdateStatus,
  route: 'objective/{id}/status'
});

app.http('objective-update-progress', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: objectiveUpdateProgress,
  route: 'objective/{id}/progress'
});

app.http('objective-complete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: objectiveComplete,
  route: 'objective/{id}/complete'
});

app.http('objective-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetStats,
  route: 'objective/stats'
});

app.http('objective-get-user-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetUserStats,
  route: 'objective/stats/user/{userId}'
});

app.http('objective-get-project-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: objectiveGetProjectStats,
  route: 'objective/stats/project/{projectId}'
}); 