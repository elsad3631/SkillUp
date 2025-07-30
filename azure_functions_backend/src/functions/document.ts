import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { documentService } from '../services/document.service';

// GET /api/document - Get all documents
export async function documentGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const documents = await documentService.getAll();

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get all documents error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve documents' }
    };
  }
}

// GET /api/document/{id} - Get document by ID
export async function documentGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const document = await documentService.getById(id);

    if (!document) {
      return {
        status: 404,
        jsonBody: { error: 'Document not found' }
      };
    }

    return {
      status: 200,
      jsonBody: document
    };

  } catch (error: any) {
    context.log('Get document by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve document' }
    };
  }
}

// GET /api/document/uploader/{uploaderId} - Get documents by uploader
export async function documentGetByUploader(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const uploaderId = (context.triggerMetadata?.uploaderId as string) || request.url.split('/').pop() || '';
    const documents = await documentService.getByUploaderId(uploaderId);

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get documents by uploader error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve documents' }
    };
  }
}

// GET /api/document/project/{projectId} - Get documents by project
export async function documentGetByProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const documents = await documentService.getByProjectId(projectId);

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get documents by project error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve documents' }
    };
  }
}

// GET /api/document/type/{type} - Get documents by type
export async function documentGetByType(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const type = (context.triggerMetadata?.type as string) || request.url.split('/').pop() || '';
    const documents = await documentService.getByType(type);

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get documents by type error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve documents' }
    };
  }
}

// GET /api/document/recent - Get recent documents
export async function documentGetRecent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const days = parseInt(request.url.split('?days=')[1] || '30');
    const documents = await documentService.getRecentDocuments(days);

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get recent documents error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve recent documents' }
    };
  }
}

// GET /api/document/large - Get large documents
export async function documentGetLarge(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const sizeMB = parseInt(request.url.split('?sizeMB=')[1] || '10');
    const documents = await documentService.getLargeDocuments(sizeMB);

    return {
      status: 200,
      jsonBody: documents
    };

  } catch (error: any) {
    context.log('Get large documents error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve large documents' }
    };
  }
}

// POST /api/document - Create new document
export async function documentCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const document = await documentService.create(body);

    return {
      status: 201,
      jsonBody: document
    };

  } catch (error: any) {
    context.log('Create document error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create document' }
    };
  }
}

// PUT /api/document/{id} - Update document
export async function documentUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const document = await documentService.update(id, body);

    return {
      status: 200,
      jsonBody: document
    };

  } catch (error: any) {
    context.log('Update document error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update document' }
    };
  }
}

// DELETE /api/document/{id} - Delete document
export async function documentRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    await documentService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete document error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete document' }
    };
  }
}

// POST /api/document/{id}/download - Download document
export async function documentDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const downloadUrl = await documentService.generateDownloadUrl(id);

    return {
      status: 200,
      jsonBody: { downloadUrl }
    };

  } catch (error: any) {
    context.log('Download document error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to generate download URL' }
    };
  }
}

// POST /api/document/{id}/share - Share document
export async function documentShare(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const shareUrl = await documentService.generateShareUrl(id, body.expiryHours);

    return {
      status: 200,
      jsonBody: { shareUrl }
    };

  } catch (error: any) {
    context.log('Share document error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to generate share URL' }
    };
  }
}

// POST /api/document/{id}/version - Create new version
export async function documentCreateVersion(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    const version = await documentService.createVersion(id, body);

    return {
      status: 201,
      jsonBody: version
    };

  } catch (error: any) {
    context.log('Create document version error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create document version' }
    };
  }
}

// GET /api/document/{id}/versions - Get document versions
export async function documentGetVersions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const versions = await documentService.getVersions(id);

    return {
      status: 200,
      jsonBody: versions
    };

  } catch (error: any) {
    context.log('Get document versions error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve document versions' }
    };
  }
}

// GET /api/document/stats - Get document stats
export async function documentGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await documentService.getDocumentStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get document stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve document stats' }
    };
  }
}

// GET /api/document/stats/uploader/{uploaderId} - Get uploader document stats
export async function documentGetUploaderStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const uploaderId = (context.triggerMetadata?.uploaderId as string) || request.url.split('/').pop() || '';
    const stats = await documentService.getDocumentStatsByUser(uploaderId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get uploader document stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve uploader document stats' }
    };
  }
}

// GET /api/document/stats/project/{projectId} - Get project document stats
export async function documentGetProjectStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const projectId = (context.triggerMetadata?.projectId as string) || request.url.split('/').pop() || '';
    const stats = await documentService.getDocumentStatsByProject(projectId);

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get project document stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve project document stats' }
    };
  }
}

// Configure the routes
app.http('document-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetAll,
  route: 'document'
});

app.http('document-get-by-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetById,
  route: 'document/{id}'
});

app.http('document-get-by-uploader', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetByUploader,
  route: 'document/uploader/{uploaderId}'
});

app.http('document-get-by-project', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetByProject,
  route: 'document/project/{projectId}'
});

app.http('document-get-by-type', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetByType,
  route: 'document/type/{type}'
});

app.http('document-get-recent', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetRecent,
  route: 'document/recent'
});

app.http('document-get-large', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetLarge,
  route: 'document/large'
});

app.http('document-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: documentCreate,
  route: 'document'
});

app.http('document-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: documentUpdate,
  route: 'document/{id}'
});

app.http('document-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: documentRemove,
  route: 'document/{id}'
});

app.http('document-download', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: documentDownload,
  route: 'document/{id}/download'
});

app.http('document-share', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: documentShare,
  route: 'document/{id}/share'
});

app.http('document-create-version', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: documentCreateVersion,
  route: 'document/{id}/version'
});

app.http('document-get-versions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetVersions,
  route: 'document/{id}/versions'
});

app.http('document-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetStats,
  route: 'document/stats'
});

app.http('document-get-uploader-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetUploaderStats,
  route: 'document/stats/uploader/{uploaderId}'
});

app.http('document-get-project-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: documentGetProjectStats,
  route: 'document/stats/project/{projectId}'
}); 