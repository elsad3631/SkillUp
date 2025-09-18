import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { assetService } from '../services/asset.service';
import { authService } from '../services/auth.service';

// GET /api/asset - Get all assets for logged user
export async function assetGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Token di autenticazione richiesto' }
      };
    }

    const token = authHeader.substring(7);
    const user = authService.verifyToken(token);
    
    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Token non valido' }
      };
    }

    const assets = await assetService.getAll(user.userId);

    return {
      status: 200,
      jsonBody: assets
    };

  } catch (error: any) {
    context.log('Get all assets error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nel recupero degli asset' }
    };
  }
}

// GET /api/asset/{id} - Get asset by ID
export async function assetGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = Number((context.triggerMetadata?.id as string) || request.url.split('/').pop() || '0');
    const asset = await assetService.getById(id);

    if (!asset) {
      return {
        status: 404,
        jsonBody: { error: 'Asset non trovato' }
      };
    }

    return {
      status: 200,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Get asset by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nel recupero dell\'asset' }
    };
  }
}

// GET /api/asset/type/{type}/company/{company} - Get assets by type and company
export async function assetGetByTypeAndCompany(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Token di autenticazione richiesto' }
      };
    }

    const token = authHeader.substring(7);
    const user = authService.verifyToken(token);
    
    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Token non valido' }
      };
    }

    // Extract type and company from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const typeIndex = pathSegments.indexOf('type');
    const companyIndex = pathSegments.indexOf('company');
    
    if (typeIndex === -1 || companyIndex === -1 || typeIndex + 1 >= pathSegments.length || companyIndex + 1 >= pathSegments.length) {
      return {
        status: 400,
        jsonBody: { error: 'Type and company parameters are required' }
      };
    }

    const type = decodeURIComponent(pathSegments[typeIndex + 1]);
    const company = decodeURIComponent(pathSegments[companyIndex + 1]);

    const assets = await assetService.getByTypeAndCompany(type, company);

    return {
      status: 200,
      jsonBody: assets
    };

  } catch (error: any) {
    context.log('Get assets by type and company error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nel recupero degli asset' }
    };
  }
}

// POST /api/asset - Create new asset for logged user
export async function assetCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Token di autenticazione richiesto' }
      };
    }

    const token = authHeader.substring(7);
    const user = authService.verifyToken(token);
    
    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Token non valido' }
      };
    }

    const body = await request.json() as { name: string; type: string; enable?: boolean };
    const { name, type, enable } = body;

    if (!name || !type) {
      return {
        status: 400,
        jsonBody: { error: 'name e type sono obbligatori' }
      };
    }

    const asset = await assetService.create({ 
      name, 
      type, 
      enable: enable ?? true,
      applicationUserId: user.userId 
    });

    return {
      status: 201,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Create asset error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nella creazione dell\'asset' }
    };
  }
}

// PUT /api/asset/{id} - Update asset for logged user
export async function assetUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Token di autenticazione richiesto' }
      };
    }

    const token = authHeader.substring(7);
    const user = authService.verifyToken(token);
    
    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Token non valido' }
      };
    }

    const id = Number((context.triggerMetadata?.id as string) || request.url.split('/').pop() || '0');
    const body = await request.json() as { name?: string; type?: string; enable?: boolean };
    const { name, type, enable } = body;

    // Verify that the asset belongs to the user
    const existingAsset = await assetService.getById(id);
    if (!existingAsset) {
      return {
        status: 404,
        jsonBody: { error: 'Asset non trovato' }
      };
    }

    if (existingAsset.applicationUserId !== user.userId) {
      return {
        status: 403,
        jsonBody: { error: 'Non autorizzato a modificare questo asset' }
      };
    }

    const asset = await assetService.update(id, { name, type, enable });

    return {
      status: 200,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Update asset error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nell\'aggiornamento dell\'asset' }
    };
  }
}

// DELETE /api/asset/{id} - Remove asset for logged user
export async function assetRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Token di autenticazione richiesto' }
      };
    }

    const token = authHeader.substring(7);
    const user = authService.verifyToken(token);
    
    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Token non valido' }
      };
    }

    const id = Number((context.triggerMetadata?.id as string) || request.url.split('/').pop() || '0');

    // Verify that the asset belongs to the user
    const existingAsset = await assetService.getById(id);
    if (!existingAsset) {
      return {
        status: 404,
        jsonBody: { error: 'Asset non trovato' }
      };
    }

    if (existingAsset.applicationUserId !== user.userId) {
      return {
        status: 403,
        jsonBody: { error: 'Non autorizzato a cancellare questo asset' }
      };
    }

    await assetService.remove(id);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Remove asset error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Errore nella cancellazione dell\'asset' }
    };
  }
}

// Register all routes
app.http('assetGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'asset',
  handler: assetGetAll
});

app.http('assetGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'asset/{id}',
  handler: assetGetById
});

app.http('assetCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'asset',
  handler: assetCreate
});

app.http('assetUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'asset/{id}',
  handler: assetUpdate
});

app.http('assetRemove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'asset/{id}',
  handler: assetRemove
});

app.http('assetGetByTypeAndCompany', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'asset/type/{type}/company/{company}',
  handler: assetGetByTypeAndCompany
}); 