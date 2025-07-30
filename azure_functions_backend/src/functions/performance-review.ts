import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { performanceReviewService } from '../services/performance-review.service';

// GET /api/performance-review - Get all performance reviews
export async function performanceReviewGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const reviews = await performanceReviewService.getAll();

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get all performance reviews error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve performance reviews' }
    };
  }
}

// GET /api/performance-review/{id} - Get performance review by ID
export async function performanceReviewGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const review = await performanceReviewService.getById(id);

    if (!review) {
      return {
        status: 404,
        jsonBody: { error: 'Performance review not found' }
      };
    }

    return {
      status: 200,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Get performance review by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve performance review' }
    };
  }
}

// GET /api/performance-review/employee/{employeeId} - Get reviews by employee
export async function performanceReviewGetByEmployee(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const employeeId = (context.triggerMetadata?.employeeId as string) || request.url.split('/').pop() || '';
    const reviews = await performanceReviewService.getByEmployeeId(employeeId);

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get performance reviews by employee error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve performance reviews' }
    };
  }
}

// GET /api/performance-review/reviewer/{reviewerId} - Get reviews by reviewer
export async function performanceReviewGetByReviewer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const reviewerId = (context.triggerMetadata?.reviewerId as string) || request.url.split('/').pop() || '';
    const reviews = await performanceReviewService.getByReviewerId(reviewerId);

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get performance reviews by reviewer error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve performance reviews' }
    };
  }
}

// GET /api/performance-review/status/{status} - Get reviews by status
export async function performanceReviewGetByStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const status = (context.triggerMetadata?.status as string) || request.url.split('/').pop() || '';
    const reviews = await performanceReviewService.getByStatus(status);

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get performance reviews by status error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve performance reviews' }
    };
  }
}

// GET /api/performance-review/pending - Get pending reviews
export async function performanceReviewGetPending(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const reviews = await performanceReviewService.getPendingReviews();

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get pending performance reviews error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve pending reviews' }
    };
  }
}

// GET /api/performance-review/overdue - Get overdue reviews
export async function performanceReviewGetOverdue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const reviews = await performanceReviewService.getOverdueReviews();

    return {
      status: 200,
      jsonBody: reviews
    };

  } catch (error: any) {
    context.log('Get overdue performance reviews error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve overdue reviews' }
    };
  }
}

// POST /api/performance-review - Create new performance review
export async function performanceReviewCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const review = await performanceReviewService.create(body);

    return {
      status: 201,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Create performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create performance review' }
    };
  }
}

// PUT /api/performance-review/{id} - Update performance review
export async function performanceReviewUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const review = await performanceReviewService.update(id, body);

    return {
      status: 200,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Update performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update performance review' }
    };
  }
}

// DELETE /api/performance-review/{id} - Delete performance review
export async function performanceReviewRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await performanceReviewService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete performance review' }
    };
  }
}

// POST /api/performance-review/{id}/submit - Submit for approval
export async function performanceReviewSubmit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const review = await performanceReviewService.submitForApproval(id);

    return {
      status: 200,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Submit performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to submit performance review' }
    };
  }
}

// POST /api/performance-review/{id}/approve - Approve review
export async function performanceReviewApprove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const review = await performanceReviewService.approve(id);

    return {
      status: 200,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Approve performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to approve performance review' }
    };
  }
}

// POST /api/performance-review/{id}/complete - Complete review
export async function performanceReviewComplete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const review = await performanceReviewService.complete(id);

    return {
      status: 200,
      jsonBody: review
    };

  } catch (error: any) {
    context.log('Complete performance review error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to complete performance review' }
    };
  }
}

// GET /api/performance-review/stats/employee/{employeeId} - Get employee stats
export async function performanceReviewGetEmployeeStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const employeeId = (context.triggerMetadata?.employeeId as string) || request.url.split('/').pop() || '';
    const stats = await performanceReviewService.getAverageScoresByEmployee(employeeId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get employee performance stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve employee stats' }
    };
  }
}

// Configure the routes
app.http('performance-review-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetAll,
  route: 'performance-review'
});

app.http('performance-review-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetById,
  route: 'performance-review/{id}'
});

app.http('performance-review-get-by-employee', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetByEmployee,
  route: 'performance-review/employee/{employeeId}'
});

app.http('performance-review-get-by-reviewer', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetByReviewer,
  route: 'performance-review/reviewer/{reviewerId}'
});

app.http('performance-review-get-by-status', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetByStatus,
  route: 'performance-review/status/{status}'
});

app.http('performance-review-get-pending', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetPending,
  route: 'performance-review/pending'
});

app.http('performance-review-get-overdue', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetOverdue,
  route: 'performance-review/overdue'
});

app.http('performance-review-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: performanceReviewCreate,
  route: 'performance-review'
});

app.http('performance-review-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: performanceReviewUpdate,
  route: 'performance-review/{id}'
});

app.http('performance-review-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: performanceReviewRemove,
  route: 'performance-review/{id}'
});

app.http('performance-review-submit', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: performanceReviewSubmit,
  route: 'performance-review/{id}/submit'
});

app.http('performance-review-approve', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: performanceReviewApprove,
  route: 'performance-review/{id}/approve'
});

app.http('performance-review-complete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: performanceReviewComplete,
  route: 'performance-review/{id}/complete'
});

app.http('performance-review-get-employee-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: performanceReviewGetEmployeeStats,
  route: 'performance-review/stats/employee/{employeeId}'
}); 