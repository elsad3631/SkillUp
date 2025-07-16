import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { blobStorageService } from '../services/blobstorage.service';

// POST /api/blobstorage/container/init
export async function blobstorageInitializeContainer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'POST') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  await blobStorageService.initializeContainer();
  return { status: 200, jsonBody: { message: 'Container initialized successfully' } };
}

// POST /api/blobstorage/upload (supports both JSON base64 and multipart/form-data)
export async function blobstorageUploadFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'POST') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }

  const contentType = request.headers.get('content-type') || '';
  let fileBuffer: Buffer;
  let originalname: string;
  let mimetype: string;
  let prefix: string | undefined;
  let customName: string | undefined;

  try {
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data
      const formData = await request.formData();
      const fileEntry = formData.get('file');
      
      if (!fileEntry || !(fileEntry instanceof File)) {
        return { status: 400, jsonBody: { message: 'No file provided in form data or invalid file type' } };
      }

      fileBuffer = Buffer.from(await fileEntry.arrayBuffer());
      originalname = fileEntry.name;
      mimetype = fileEntry.type || 'application/octet-stream';
      prefix = formData.get('prefix') as string || undefined;
      customName = formData.get('customName') as string || undefined;
      
      context.log(`Processing multipart file: ${originalname}, type: ${mimetype}, size: ${fileBuffer.length}`);
    } else {
      // Handle JSON with base64
      const body: any = await request.json();
      const { fileBase64, originalname: origName, mimetype: mimeType, prefix: pref, customName: custom } = body;
      
      if (!fileBase64 || !origName || !mimeType) {
        return { status: 400, jsonBody: { message: 'No file provided or missing required fields' } };
      }

      fileBuffer = Buffer.from(fileBase64, 'base64');
      originalname = origName;
      mimetype = mimeType;
      prefix = pref;
      customName = custom;
      
      context.log(`Processing base64 file: ${originalname}, type: ${mimetype}, size: ${fileBuffer.length}`);
    }

    const fileName = customName || blobStorageService.generateUniqueFileName(originalname, prefix);
    const fileUrl = await blobStorageService.uploadFile(fileName, fileBuffer, mimetype);
    
    return {
      status: 201,
      jsonBody: {
        message: 'File uploaded successfully',
        fileName,
        fileUrl,
        size: fileBuffer.length,
        contentType: mimetype,
      }
    };
  } catch (error) {
    context.error('Error processing upload:', error);
    return { 
      status: 500, 
      jsonBody: { 
        message: 'Error processing file upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      } 
    };
  }
}

// POST /api/blobstorage/upload/multiple (supports both JSON base64 and multipart/form-data)
export async function blobstorageUploadMultipleFiles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'POST') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }

  const contentType = request.headers.get('content-type') || '';
  let files: Array<{ originalName: string; fileName: string; fileUrl: string; size: number; contentType: string }> = [];

  try {
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data
      const formData = await request.formData();
      const fileEntries = formData.getAll('files');
      const prefix = formData.get('prefix') as string || undefined;
      
      if (!fileEntries || fileEntries.length === 0) {
        return { status: 400, jsonBody: { message: 'No files provided in form data' } };
      }

      const uploadPromises = fileEntries.map(async (fileEntry) => {
        if (!(fileEntry instanceof File)) {
          throw new Error('Invalid file type in form data');
        }

        const fileBuffer = Buffer.from(await fileEntry.arrayBuffer());
        const fileName = blobStorageService.generateUniqueFileName(fileEntry.name, prefix);
        const fileUrl = await blobStorageService.uploadFile(fileName, fileBuffer, fileEntry.type || 'application/octet-stream');
        
        return {
          originalName: fileEntry.name,
          fileName,
          fileUrl,
          size: fileBuffer.length,
          contentType: fileEntry.type || 'application/octet-stream',
        };
      });

      files = await Promise.all(uploadPromises);
      context.log(`Processed ${files.length} multipart files`);
    } else {
      // Handle JSON with base64
      const body: any = await request.json();
      const { files: jsonFiles, prefix } = body; // files: [{ fileBase64, originalname, mimetype }]
      
      if (!Array.isArray(jsonFiles) || jsonFiles.length === 0) {
        return { status: 400, jsonBody: { message: 'No files provided or invalid format' } };
      }

      const uploadPromises = jsonFiles.map(async (file: any) => {
        const buffer = Buffer.from(file.fileBase64, 'base64');
        const fileName = blobStorageService.generateUniqueFileName(file.originalname, prefix);
        const fileUrl = await blobStorageService.uploadFile(fileName, buffer, file.mimetype);
        return {
          originalName: file.originalname,
          fileName,
          fileUrl,
          size: buffer.length,
          contentType: file.mimetype,
        };
      });

      files = await Promise.all(uploadPromises);
      context.log(`Processed ${files.length} base64 files`);
    }

    return {
      status: 201,
      jsonBody: {
        message: 'Files uploaded successfully',
        files,
        count: files.length,
      }
    };
  } catch (error) {
    context.error('Error processing multiple files upload:', error);
    return { 
      status: 500, 
      jsonBody: { 
        message: 'Error processing multiple files upload',
        error: error instanceof Error ? error.message : 'Unknown error'
      } 
    };
  }
}

// GET /api/blobstorage/avatar/{fileName}
export async function blobstorageServeAvatar(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage/avatar'
    const avatarIndex = pathParts.findIndex(part => part === 'avatar');
    if (avatarIndex !== -1 && avatarIndex + 1 < pathParts.length) {
      // Take everything after 'avatar' as the fileName
      fileName = pathParts.slice(avatarIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  // Handle new path structure: avatars/employees/id/filename
  // Use the full path as provided
  const avatarPath = fileName;
  const exists = await blobStorageService.fileExists(avatarPath);
  if (!exists) {
    return { status: 404, jsonBody: { message: 'Avatar not found' } };
  }
  
  try {
    const fileBuffer = await blobStorageService.getFileBuffer(avatarPath);
    const properties = await blobStorageService.getFileProperties(avatarPath);
    
    return {
      status: 200,
      body: fileBuffer,
      headers: {
        'Content-Type': properties.contentType || 'image/jpeg',
        'Content-Length': properties.contentLength?.toString() || '',
        'Cache-Control': 'public, max-age=31536000',
        'ETag': properties.etag || '',
      } as Record<string, string>
    };
  } catch (error) {
    context.log('Error serving avatar:', error);
    return { status: 500, jsonBody: { message: 'Error serving avatar image' } };
  }
}

// GET /api/blobstorage/download/{fileName}
export async function blobstorageDownloadFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage/download'
    const downloadIndex = pathParts.findIndex(part => part === 'download');
    if (downloadIndex !== -1 && downloadIndex + 1 < pathParts.length) {
      // Take everything after 'download' as the fileName
      fileName = pathParts.slice(downloadIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  const exists = await blobStorageService.fileExists(fileName);
  if (!exists) {
    return { status: 404, jsonBody: { message: 'File not found' } };
  }
  const fileBuffer = await blobStorageService.getFileBuffer(fileName);
  const properties = await blobStorageService.getFileProperties(fileName);
  return {
    status: 200,
    body: fileBuffer,
    headers: {
      'Content-Type': properties.contentType || 'application/octet-stream',
      'Content-Length': properties.contentLength?.toString() || '',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    } as Record<string, string>
  };
}

// GET /api/blobstorage/info/{fileName}
export async function blobstorageGetFileInfo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage/info'
    const infoIndex = pathParts.findIndex(part => part === 'info');
    if (infoIndex !== -1 && infoIndex + 1 < pathParts.length) {
      // Take everything after 'info' as the fileName
      fileName = pathParts.slice(infoIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  const exists = await blobStorageService.fileExists(fileName);
  if (!exists) {
    return { status: 404, jsonBody: { message: 'File not found' } };
  }
  const properties = await blobStorageService.getFileProperties(fileName);
  return {
    status: 200,
    jsonBody: {
      fileName,
      exists: true,
      properties,
    }
  };
}

// GET /api/blobstorage/exists/{fileName}
export async function blobstorageFileExists(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage/exists'
    const existsIndex = pathParts.findIndex(part => part === 'exists');
    if (existsIndex !== -1 && existsIndex + 1 < pathParts.length) {
      // Take everything after 'exists' as the fileName
      fileName = pathParts.slice(existsIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  const exists = await blobStorageService.fileExists(fileName);
  return {
    status: 200,
    jsonBody: {
      fileName,
      exists,
    }
  };
}

// DELETE /api/blobstorage/{fileName}
export async function blobstorageDeleteFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'DELETE') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage'
    const blobstorageIndex = pathParts.findIndex(part => part === 'blobstorage');
    if (blobstorageIndex !== -1 && blobstorageIndex + 1 < pathParts.length) {
      // Take everything after 'blobstorage' as the fileName
      fileName = pathParts.slice(blobstorageIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  context.log(`Attempting to delete file: ${fileName}`);
  
  const exists = await blobStorageService.fileExists(fileName);
  if (!exists) {
    return { status: 404, jsonBody: { message: 'File not found' } };
  }
  
  await blobStorageService.deleteFile(fileName);
  return { status: 200, jsonBody: { message: 'File deleted successfully', fileName } };
}

// POST /api/blobstorage/copy
export async function blobstorageCopyFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'POST') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  const body: any = await request.json();
  const { sourceFileName, destinationFileName } = body;
  if (!sourceFileName || !destinationFileName) {
    return { status: 400, jsonBody: { message: 'Source file name and destination file name are required' } };
  }
  await blobStorageService.copyFile(sourceFileName, destinationFileName);
  return { status: 200, jsonBody: { message: 'File copied successfully', sourceFileName, destinationFileName } };
}

// GET /api/blobstorage/list
export async function blobstorageListFiles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || undefined;
  const limit = parseInt(url.searchParams.get('limit') || '100');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const files = await blobStorageService.listFiles(prefix);
  const paginatedFiles = files.slice(offset, offset + limit);
  return {
    status: 200,
    jsonBody: {
      files: paginatedFiles.map(blob => ({
        name: blob.name,
        size: blob.properties.contentLength,
        contentType: blob.properties.contentType,
        lastModified: blob.properties.lastModified,
        etag: blob.properties.etag,
      })),
      total: files.length,
      limit,
      offset,
      hasMore: offset + limit < files.length,
    }
  };
}

// GET /api/blobstorage/stats
export async function blobstorageGetStorageStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  // Implementa la logica per le statistiche se presente nel service
  return { status: 501, jsonBody: { message: 'Not implemented' } };
}

// GET /api/blobstorage/sas/{fileName}
export async function blobstorageGenerateSasUrl(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'GET') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  // Extract fileName from URL path, handling multi-level paths
  let fileName = context.triggerMetadata?.fileName as string;
  if (!fileName) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Remove empty parts and find the index after 'blobstorage/sas'
    const sasIndex = pathParts.findIndex(part => part === 'sas');
    if (sasIndex !== -1 && sasIndex + 1 < pathParts.length) {
      // Take everything after 'sas' as the fileName
      fileName = pathParts.slice(sasIndex + 1).join('/');
    } else {
      fileName = '';
    }
  }
  
  if (!fileName) {
    return { status: 400, jsonBody: { message: 'File name is required' } };
  }
  
  // Decode the fileName in case it's URL encoded
  fileName = decodeURIComponent(fileName);
  
  if (!blobStorageService.generateSasUrl) {
    return { status: 501, jsonBody: { message: 'Not implemented' } };
  }
  const sasUrl = await blobStorageService.generateSasUrl(fileName);
  return { status: 200, jsonBody: { fileName, sasUrl } };
}

// POST /api/blobstorage/bulk/delete
export async function blobstorageBulkDeleteFiles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  if (request.method !== 'POST') {
    return { status: 405, jsonBody: { error: 'Method not allowed' } };
  }
  
  try {
    const body: any = await request.json();
    const { fileNames } = body;
    
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return { status: 400, jsonBody: { message: 'fileNames must be a non-empty array' } };
    }
    
    context.log(`Attempting to bulk delete ${fileNames.length} files`);
    
    const result = await blobStorageService.bulkDeleteFiles(fileNames);
    
    return { 
      status: 200, 
      jsonBody: { 
        message: 'Bulk delete operation completed',
        total: result.total,
        deleted: result.deleted,
        failed: result.failed,
        results: result.results
      } 
    };
  } catch (error) {
    context.error('Error in bulk delete operation:', error);
    return { 
      status: 500, 
      jsonBody: { 
        message: 'Error during bulk delete operation',
        error: error instanceof Error ? error.message : 'Unknown error'
      } 
    };
  }
}

// Route registration
app.http('blobstorageInitializeContainer', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blobstorage/container/init',
  handler: blobstorageInitializeContainer
});
app.http('blobstorageUploadFile', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blobstorage/upload',
  handler: blobstorageUploadFile
});
app.http('blobstorageUploadMultipleFiles', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blobstorage/upload/multiple',
  handler: blobstorageUploadMultipleFiles
});
app.http('blobstorageServeAvatar', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/avatar/{*fileName}',
  handler: blobstorageServeAvatar
});
app.http('blobstorageDownloadFile', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/download/{fileName}',
  handler: blobstorageDownloadFile
});
app.http('blobstorageGetFileInfo', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/info/{fileName}',
  handler: blobstorageGetFileInfo
});
app.http('blobstorageFileExists', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/exists/{fileName}',
  handler: blobstorageFileExists
});
app.http('blobstorageDeleteFile', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'blobstorage/{fileName}',
  handler: blobstorageDeleteFile
});
app.http('blobstorageCopyFile', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blobstorage/copy',
  handler: blobstorageCopyFile
});
app.http('blobstorageListFiles', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/list',
  handler: blobstorageListFiles
});
app.http('blobstorageGetStorageStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/stats',
  handler: blobstorageGetStorageStats
});
app.http('blobstorageGenerateSasUrl', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobstorage/sas/{fileName}',
  handler: blobstorageGenerateSasUrl
});
app.http('blobstorageBulkDeleteFiles', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'blobstorage/bulk/delete',
  handler: blobstorageBulkDeleteFiles
}); 