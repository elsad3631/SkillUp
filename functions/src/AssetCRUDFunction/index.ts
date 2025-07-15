import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { assetService } from '../services/asset.service';

export async function assetGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const assets = await assetService.getAllAssets();

    return {
      status: 200,
      jsonBody: assets
    };

  } catch (error: any) {
    context.log('Get all assets error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve assets' }
    };
  }
}

export async function assetGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
      return {
        status: 400,
        jsonBody: { error: 'Valid asset ID is required' }
      };
    }

    const asset = await assetService.getAssetById(id);

    return {
      status: 200,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Get asset by ID error:', error);
    
    if (error.message === 'Asset not found') {
      return {
        status: 404,
        jsonBody: { error: 'Asset not found' }
      };
    }
    
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve asset' }
    };
  }
}

export async function assetCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as any;

    if (!body.name || !body.type) {
      return {
        status: 400,
        jsonBody: { error: 'Asset name and type are required' }
      };
    }

    const asset = await assetService.createAsset(body);

    return {
      status: 201,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Create asset error:', error);
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to create asset' }
    };
  }
}

export async function assetUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
      return {
        status: 400,
        jsonBody: { error: 'Valid asset ID is required' }
      };
    }

    const body = await request.json() as any;

    const asset = await assetService.updateAsset(id, body);

    return {
      status: 200,
      jsonBody: asset
    };

  } catch (error: any) {
    context.log('Update asset error:', error);
    
    if (error.message === 'Asset not found') {
      return {
        status: 404,
        jsonBody: { error: 'Asset not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to update asset' }
    };
  }
}

export async function assetDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
      return {
        status: 400,
        jsonBody: { error: 'Valid asset ID is required' }
      };
    }

    await assetService.deleteAsset(id);

    return {
      status: 204,
      body: ''
    };

  } catch (error: any) {
    context.log('Delete asset error:', error);
    
    if (error.message === 'Asset not found') {
      return {
        status: 404,
        jsonBody: { error: 'Asset not found' }
      };
    }
    
    return {
      status: 400,
      jsonBody: { error: error.message || 'Failed to delete asset' }
    };
  }
}

app.http('assetGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'assets',
  handler: assetGetAll
});

app.http('assetGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'assets/{id}',
  handler: assetGetById
});

app.http('assetCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'assets',
  handler: assetCreate
});

app.http('assetUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'assets/{id}',
  handler: assetUpdate
});

app.http('assetDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'assets/{id}',
  handler: assetDelete
}); 