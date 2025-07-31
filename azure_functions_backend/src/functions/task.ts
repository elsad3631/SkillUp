import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { taskService } from '../services/task.service';

// GET /api/task - Get all tasks
export async function taskGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const tasks = await taskService.getAll();

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get all tasks error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/{id} - Get task by ID
export async function taskGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const task = await taskService.getById(id);

    if (!task) {
      return {
        status: 404,
        jsonBody: { error: 'Task not found' }
      };
    }

    return {
      status: 200,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Get task by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve task' }
    };
  }
}

// GET /api/task/assigned/{userId} - Get tasks assigned to user
export async function taskGetByAssignedTo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const tasks = await taskService.getByAssignedTo(userId);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks by assigned to error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/created/{userId} - Get tasks created by user
export async function taskGetByCreatedBy(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const tasks = await taskService.getByCreatedBy(userId);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks by created by error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/project/{projectId} - Get tasks by project
export async function taskGetByProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const tasks = await taskService.getByProjectId(projectId);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks by project error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/status/{status} - Get tasks by status
export async function taskGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const tasks = await taskService.getByStatus(status);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/priority/{priority} - Get tasks by priority
export async function taskGetByPriority(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const priority = (context.triggerMetadata?.priority as string) || request.url.split('/').pop() || '';
    const tasks = await taskService.getByPriority(priority);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks by priority error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks' }
    };
  }
}

// GET /api/task/overdue - Get overdue tasks
export async function taskGetOverdue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const tasks = await taskService.getOverdueTasks();

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get overdue tasks error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve overdue tasks' }
    };
  }
}

// GET /api/task/due-soon - Get tasks due soon
export async function taskGetDueSoon(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const days = parseInt(request.url.split('?days=')[1] || '7');
    const tasks = await taskService.getTasksDueSoon(days);

    return {
      status: 200,
      jsonBody: tasks
    };

  } catch (error: any) {
    context.log('Get tasks due soon error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve tasks due soon' }
    };
  }
}

// POST /api/task - Create new task
export async function taskCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const task = await taskService.create(body);

    return {
      status: 201,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Create task error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create task' }
    };
  }
}

// PUT /api/task/{id} - Update task
export async function taskUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const task = await taskService.update(id, body);

    return {
      status: 200,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Update task error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update task' }
    };
  }
}

// DELETE /api/task/{id} - Delete task
export async function taskRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await taskService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete task error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete task' }
    };
  }
}

// POST /api/task/{id}/assign - Assign task to user
export async function taskAssign(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const assignedTo = body.assignedTo;
    const task = await taskService.assignTask(id, assignedTo);

    return {
      status: 200,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Assign task error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to assign task' }
    };
  }
}

// POST /api/task/{id}/status - Update task status
export async function taskUpdateStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const status = body.status;
    const task = await taskService.updateStatus(id, status);

    return {
      status: 200,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Update task status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update task status' }
    };
  }
}

// POST /api/task/{id}/priority - Update task priority
export async function taskUpdatePriority(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const priority = body.priority;
    const task = await taskService.updatePriority(id, priority);

    return {
      status: 200,
      jsonBody: task
    };

  } catch (error: any) {
    context.log('Update task priority error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update task priority' }
    };
  }
}

// GET /api/task/stats - Get task stats
export async function taskGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await taskService.getTaskStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get task stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve task stats' }
    };
  }
}

// GET /api/task/stats/user/{userId} - Get user task stats
export async function taskGetUserStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const stats = await taskService.getTaskStatsByUser(userId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user task stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user task stats' }
    };
  }
}

// GET /api/task/stats/project/{projectId} - Get project task stats
export async function taskGetProjectStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const stats = await taskService.getTaskStatsByProject(projectId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get project task stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project task stats' }
    };
  }
}

// Configure the routes
app.http('task-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetAll,
  route: 'task'
});

app.http('task-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetById,
  route: 'task/{id}'
});

app.http('task-get-by-assigned-to', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetByAssignedTo,
  route: 'task/assigned/{userId}'
});

app.http('task-get-by-created-by', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetByCreatedBy,
  route: 'task/created/{userId}'
});

app.http('task-get-by-project', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetByProject,
  route: 'task/project/{projectId}'
});

app.http('task-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetByStatus,
  route: 'task/status/{status}'
});

app.http('task-get-by-priority', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetByPriority,
  route: 'task/priority/{priority}'
});

app.http('task-get-overdue', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetOverdue,
  route: 'task/overdue'
});

app.http('task-get-due-soon', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetDueSoon,
  route: 'task/due-soon'
});

app.http('task-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: taskCreate,
  route: 'task'
});

app.http('task-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: taskUpdate,
  route: 'task/{id}'
});

app.http('task-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: taskRemove,
  route: 'task/{id}'
});

app.http('task-assign', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: taskAssign,
  route: 'task/{id}/assign'
});

app.http('task-update-status', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: taskUpdateStatus,
  route: 'task/{id}/status'
});

app.http('task-update-priority', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: taskUpdatePriority,
  route: 'task/{id}/priority'
});

app.http('task-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetStats,
  route: 'task/stats'
});

app.http('task-get-user-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetUserStats,
  route: 'task/stats/user/{userId}'
});

app.http('task-get-project-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: taskGetProjectStats,
  route: 'task/stats/project/{projectId}'
}); 