import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { commentService } from '../services/comment.service';

// GET /api/comment - Get all comments
export async function commentGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const comments = await commentService.getAll();

    return {
      status: 200,
      jsonBody: comments
    };

  } catch (error: any) {
    context.log('Get all comments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve comments' }
    };
  }
}

// GET /api/comment/{id} - Get comment by ID
export async function commentGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const comment = await commentService.getById(id);

    if (!comment) {
      return {
        status: 404,
        jsonBody: { error: 'Comment not found' }
      };
    }

    return {
      status: 200,
      jsonBody: comment
    };

  } catch (error: any) {
    context.log('Get comment by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve comment' }
    };
  }
}

// GET /api/comment/author/{authorId} - Get comments by author
export async function commentGetByAuthor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const authorId = (context.triggerMetadata?.authorId as string) || request.url.split('/').pop() || '';
    const comments = await commentService.getByAuthorId(authorId);

    return {
      status: 200,
      jsonBody: comments
    };

  } catch (error: any) {
    context.log('Get comments by author error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve comments' }
    };
  }
}

// GET /api/comment/entity/{entityType}/{entityId} - Get comments by entity
export async function commentGetByEntity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const urlParts = request.url.split('/');
    const entityType = urlParts[urlParts.length - 2];
    const entityId = urlParts[urlParts.length - 1];
    const comments = await commentService.getByEntity(entityType, entityId);

    return {
      status: 200,
      jsonBody: comments
    };

  } catch (error: any) {
    context.log('Get comments by entity error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve comments' }
    };
  }
}

// GET /api/comment/parent/{parentId} - Get replies to a comment
export async function commentGetReplies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const parentId = (context.triggerMetadata?.parentId as string) || request.url.split('/').pop() || '';
    const replies = await commentService.getReplies(parentId);

    return {
      status: 200,
      jsonBody: replies
    };

  } catch (error: any) {
    context.log('Get comment replies error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve replies' }
    };
  }
}

// GET /api/comment/root - Get root comments (no parent)
export async function commentGetRoot(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const comments = await commentService.getRootComments();

    return {
      status: 200,
      jsonBody: comments
    };

  } catch (error: any) {
    context.log('Get root comments error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve root comments' }
    };
  }
}

// POST /api/comment - Create new comment
export async function commentCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const comment = await commentService.create(body);

    return {
      status: 201,
      jsonBody: comment
    };

  } catch (error: any) {
    context.log('Create comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create comment' }
    };
  }
}

// PUT /api/comment/{id} - Update comment
export async function commentUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const comment = await commentService.update(id, body);

    return {
      status: 200,
      jsonBody: comment
    };

  } catch (error: any) {
    context.log('Update comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update comment' }
    };
  }
}

// DELETE /api/comment/{id} - Delete comment
export async function commentRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await commentService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete comment' }
    };
  }
}

// POST /api/comment/{id}/like - Like comment
export async function commentLike(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const userId = body.userId;
    const comment = await commentService.likeComment(id, userId);

    return {
      status: 200,
      jsonBody: comment
    };

  } catch (error: any) {
    context.log('Like comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to like comment' }
    };
  }
}

// POST /api/comment/{id}/unlike - Unlike comment
export async function commentUnlike(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const userId = body.userId;
    const comment = await commentService.unlikeComment(id, userId);

    return {
      status: 200,
      jsonBody: comment
    };

  } catch (error: any) {
    context.log('Unlike comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to unlike comment' }
    };
  }
}

// POST /api/comment/{id}/reply - Reply to comment
export async function commentReply(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const reply = await commentService.replyToComment(id, body);

    return {
      status: 201,
      jsonBody: reply
    };

  } catch (error: any) {
    context.log('Reply to comment error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to reply to comment' }
    };
  }
}

// GET /api/comment/stats - Get comment stats
export async function commentGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await commentService.getCommentStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get comment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve comment stats' }
    };
  }
}

// GET /api/comment/stats/author/{authorId} - Get author comment stats
export async function commentGetAuthorStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const authorId = (context.triggerMetadata?.authorId as string) || request.url.split('/').pop() || '';
    const stats = await commentService.getCommentStatsByAuthor(authorId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get author comment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve author comment stats' }
    };
  }
}

// GET /api/comment/stats/entity/{entityType}/{entityId} - Get entity comment stats
export async function commentGetEntityStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const urlParts = request.url.split('/');
    const entityType = urlParts[urlParts.length - 2];
    const entityId = urlParts[urlParts.length - 1];
    const stats = await commentService.getCommentStatsByEntity(entityType, entityId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get entity comment stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve entity comment stats' }
    };
  }
}

// Configure the routes
app.http('comment-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetAll,
  route: 'comment'
});

app.http('comment-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetById,
  route: 'comment/{id}'
});

app.http('comment-get-by-author', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetByAuthor,
  route: 'comment/author/{authorId}'
});

app.http('comment-get-by-entity', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetByEntity,
  route: 'comment/entity/{entityType}/{entityId}'
});

app.http('comment-get-replies', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetReplies,
  route: 'comment/parent/{parentId}'
});

app.http('comment-get-root', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetRoot,
  route: 'comment/root'
});

app.http('comment-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: commentCreate,
  route: 'comment'
});

app.http('comment-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: commentUpdate,
  route: 'comment/{id}'
});

app.http('comment-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: commentRemove,
  route: 'comment/{id}'
});

app.http('comment-like', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: commentLike,
  route: 'comment/{id}/like'
});

app.http('comment-unlike', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: commentUnlike,
  route: 'comment/{id}/unlike'
});

app.http('comment-reply', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: commentReply,
  route: 'comment/{id}/reply'
});

app.http('comment-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetStats,
  route: 'comment/stats'
});

app.http('comment-get-author-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetAuthorStats,
  route: 'comment/stats/author/{authorId}'
});

app.http('comment-get-entity-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: commentGetEntityStats,
  route: 'comment/stats/entity/{entityType}/{entityId}'
}); 