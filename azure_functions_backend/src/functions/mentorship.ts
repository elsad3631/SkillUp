import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { mentorshipService } from '../services/mentorship.service';

// GET /api/mentorship - Get all mentorship relationships
export async function mentorshipGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const mentorships = await mentorshipService.getAll();

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get all mentorship relationships error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship relationships' }
    };
  }
}

// GET /api/mentorship/{id} - Get mentorship by ID
export async function mentorshipGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const mentorship = await mentorshipService.getById(id);

    if (!mentorship) {
      return {
        status: 404,
        jsonBody: { error: 'Mentorship relationship not found' }
      };
    }

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Get mentorship by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship relationship' }
    };
  }
}

// GET /api/mentorship/mentor/{mentorId} - Get mentorships by mentor
export async function mentorshipGetByMentor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const mentorId = (context.triggerMetadata?.mentorId as string) || request.url.split('/').pop() || '';
    const mentorships = await mentorshipService.getByMentorId(mentorId);

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get mentorships by mentor error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship relationships' }
    };
  }
}

// GET /api/mentorship/mentee/{menteeId} - Get mentorships by mentee
export async function mentorshipGetByMentee(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const menteeId = (context.triggerMetadata?.menteeId as string) || request.url.split('/').pop() || '';
    const mentorships = await mentorshipService.getByMenteeId(menteeId);

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get mentorships by mentee error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship relationships' }
    };
  }
}

// GET /api/mentorship/status/{status} - Get mentorships by status
export async function mentorshipGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const mentorships = await mentorshipService.getByStatus(status);

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get mentorships by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship relationships' }
    };
  }
}

// GET /api/mentorship/active - Get active mentorships
export async function mentorshipGetActive(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const mentorships = await mentorshipService.getActiveMentorships();

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get active mentorships error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve active mentorships' }
    };
  }
}

// GET /api/mentorship/completed - Get completed mentorships
export async function mentorshipGetCompleted(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const mentorships = await mentorshipService.getCompletedMentorships();

    return {
      status: 200,
      jsonBody: mentorships
    };

  } catch (error: any) {
    context.log('Get completed mentorships error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve completed mentorships' }
    };
  }
}

// POST /api/mentorship - Create new mentorship relationship
export async function mentorshipCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const mentorship = await mentorshipService.create(body);

    return {
      status: 201,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Create mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create mentorship relationship' }
    };
  }
}

// PUT /api/mentorship/{id} - Update mentorship relationship
export async function mentorshipUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const mentorship = await mentorshipService.update(id, body);

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Update mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update mentorship relationship' }
    };
  }
}

// DELETE /api/mentorship/{id} - Delete mentorship relationship
export async function mentorshipRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await mentorshipService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete mentorship relationship' }
    };
  }
}

// POST /api/mentorship/{id}/start - Start mentorship
export async function mentorshipStart(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const mentorship = await mentorshipService.startMentorship(id);

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Start mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to start mentorship' }
    };
  }
}

// POST /api/mentorship/{id}/complete - Complete mentorship
export async function mentorshipComplete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const mentorship = await mentorshipService.completeMentorship(id, completionNotes);

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Complete mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to complete mentorship' }
    };
  }
}

// POST /api/mentorship/{id}/pause - Pause mentorship
export async function mentorshipPause(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const pauseReason = body.pauseReason;
    const mentorship = await mentorshipService.pauseMentorship(id, pauseReason);

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Pause mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to pause mentorship' }
    };
  }
}

// POST /api/mentorship/{id}/resume - Resume mentorship
export async function mentorshipResume(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const mentorship = await mentorshipService.resumeMentorship(id);

    return {
      status: 200,
      jsonBody: mentorship
    };

  } catch (error: any) {
    context.log('Resume mentorship error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to resume mentorship' }
    };
  }
}

// GET /api/mentorship/stats - Get mentorship stats
export async function mentorshipGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await mentorshipService.getMentorshipStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get mentorship stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentorship stats' }
    };
  }
}

// GET /api/mentorship/stats/mentor/{mentorId} - Get mentor stats
export async function mentorshipGetMentorStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const mentorId = (context.triggerMetadata?.mentorId as string) || request.url.split('/').pop() || '';
    const stats = await mentorshipService.getMentorshipStatsByMentor(mentorId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get mentor stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentor stats' }
    };
  }
}

// GET /api/mentorship/stats/mentee/{menteeId} - Get mentee stats
export async function mentorshipGetMenteeStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const menteeId = (context.triggerMetadata?.menteeId as string) || request.url.split('/').pop() || '';
    const stats = await mentorshipService.getMentorshipStatsByMentee(menteeId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get mentee stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve mentee stats' }
    };
  }
}

// Configure the routes
app.http('mentorship-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetAll,
  route: 'mentorship'
});

app.http('mentorship-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetById,
  route: 'mentorship/{id}'
});

app.http('mentorship-get-by-mentor', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetByMentor,
  route: 'mentorship/mentor/{mentorId}'
});

app.http('mentorship-get-by-mentee', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetByMentee,
  route: 'mentorship/mentee/{menteeId}'
});

app.http('mentorship-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetByStatus,
  route: 'mentorship/status/{status}'
});

app.http('mentorship-get-active', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetActive,
  route: 'mentorship/active'
});

app.http('mentorship-get-completed', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetCompleted,
  route: 'mentorship/completed'
});

app.http('mentorship-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: mentorshipCreate,
  route: 'mentorship'
});

app.http('mentorship-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: mentorshipUpdate,
  route: 'mentorship/{id}'
});

app.http('mentorship-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: mentorshipRemove,
  route: 'mentorship/{id}'
});

app.http('mentorship-start', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: mentorshipStart,
  route: 'mentorship/{id}/start'
});

app.http('mentorship-complete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: mentorshipComplete,
  route: 'mentorship/{id}/complete'
});

app.http('mentorship-pause', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: mentorshipPause,
  route: 'mentorship/{id}/pause'
});

app.http('mentorship-resume', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: mentorshipResume,
  route: 'mentorship/{id}/resume'
});

app.http('mentorship-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetStats,
  route: 'mentorship/stats'
});

app.http('mentorship-get-mentor-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetMentorStats,
  route: 'mentorship/stats/mentor/{mentorId}'
});

app.http('mentorship-get-mentee-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: mentorshipGetMenteeStats,
  route: 'mentorship/stats/mentee/{menteeId}'
}); 