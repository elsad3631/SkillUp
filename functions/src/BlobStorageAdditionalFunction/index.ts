import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { blobStorageService } from '../services/blobstorage.service';

export async function blobInitContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    await blobStorageService.initializeContainer();

    return {
      status: 200,
      jsonBody: { message: 'Container initialized successfully' }
    };

  } catch (error: any) {
    context.log('Blob init container error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to initialize container' }
    };
  }
}

export async function blobGetInfo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const fileName = request.params.fileName;
    if (!fileName) {
      return {
        status: 400,
        jsonBody: { error: 'File name is required' }
      };
    }

    const properties = await blobStorageService.getFileProperties(fileName);

    return {
      status: 200,
      jsonBody: properties
    };

  } catch (error: any) {
    context.log('Blob get info error:', error);
    return {
      status: 404,
      jsonBody: { error: error.message || 'File info not found' }
    };
  }
}

export async function blobExists(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const fileName = request.params.fileName;
    if (!fileName) {
      return {
        status: 400,
        jsonBody: { error: 'File name is required' }
      };
    }

    const exists = await blobStorageService.fileExists(fileName);

    return {
      status: 200,
      jsonBody: { exists }
    };

  } catch (error: any) {
    context.log('Blob exists error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to check file existence' }
    };
  }
}

export async function blobGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const containerInfo = await blobStorageService.getContainerInfo();

    return {
      status: 200,
      jsonBody: containerInfo
    };

  } catch (error: any) {
    context.log('Blob get stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to get storage stats' }
    };
  }
}

export async function blobServeAvatar(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const fileName = request.params.fileName;
    if (!fileName) {
      return {
        status: 400,
        jsonBody: { error: 'File name is required' }
      };
    }

    // For avatars, we can generate a SAS URL or serve directly
    const result = await blobStorageService.downloadFile(fileName);

    return {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=86400' // Cache for 1 day
      },
      body: result.content
    };

  } catch (error: any) {
    context.log('Blob serve avatar error:', error);
    return {
      status: 404,
      jsonBody: { error: error.message || 'Avatar not found' }
    };
  }
}

app.http('blobInitContainer', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blob-storage/container/init',
  handler: blobInitContainer
});

app.http('blobGetInfo', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/info/{fileName}',
  handler: blobGetInfo
});

app.http('blobExists', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/exists/{fileName}',
  handler: blobExists
});

app.http('blobGetStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/stats',
  handler: blobGetStats
});

app.http('blobServeAvatar', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/avatar/{fileName}',
  handler: blobServeAvatar
}); 