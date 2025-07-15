import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { blobStorageService } from '../services/blobstorage.service';

export async function blobUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // For file uploads in Azure Functions, you'd typically handle multipart/form-data
    // This is a simplified example - in real scenarios you'd use a proper multipart parser
    const body = await request.arrayBuffer();
    const fileName = request.headers.get('x-file-name') || 'uploaded-file';
    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    if (!body || body.byteLength === 0) {
      return {
        status: 400,
        jsonBody: { error: 'File content is required' }
      };
    }

    const buffer = Buffer.from(body);
    const result = await blobStorageService.uploadFile(buffer, fileName, contentType);

    return {
      status: 200,
      jsonBody: result
    };

  } catch (error: any) {
    context.log('Blob upload error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to upload file' }
    };
  }
}

export async function blobDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const result = await blobStorageService.downloadFile(fileName);

    return {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      },
      body: result.content
    };

  } catch (error: any) {
    context.log('Blob download error:', error);
    return {
      status: 404,
      jsonBody: { error: error.message || 'File not found' }
    };
  }
}

export async function blobDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
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

    const success = await blobStorageService.deleteFile(fileName);

    if (success) {
      return {
        status: 204,
        body: ''
      };
    } else {
      return {
        status: 404,
        jsonBody: { error: 'File not found' }
      };
    }

  } catch (error: any) {
    context.log('Blob delete error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete file' }
    };
  }
}

export async function blobList(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || undefined;

    const files = await blobStorageService.listFiles(prefix);

    return {
      status: 200,
      jsonBody: { files }
    };

  } catch (error: any) {
    context.log('Blob list error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to list files' }
    };
  }
}

export async function blobGenerateSAS(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const url = new URL(request.url);
    const expiresInMinutes = parseInt(url.searchParams.get('expiresInMinutes') || '60');

    const sasUrl = blobStorageService.generateSASUrl(fileName, expiresInMinutes);

    return {
      status: 200,
      jsonBody: { sasUrl }
    };

  } catch (error: any) {
    context.log('Blob generate SAS error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to generate SAS URL' }
    };
  }
}

app.http('blobUpload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blob-storage/upload',
  handler: blobUpload
});

app.http('blobDownload', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/download/{fileName}',
  handler: blobDownload
});

app.http('blobDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'blob-storage/{fileName}',
  handler: blobDelete
});

app.http('blobList', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/list',
  handler: blobList
});

app.http('blobGenerateSAS', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blob-storage/sas/{fileName}',
  handler: blobGenerateSAS
}); 