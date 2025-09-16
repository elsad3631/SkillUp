import { HttpRequest, InvocationContext, HttpResponseInit, app } from '@azure/functions';
import { CustomerService, CreateCustomerDto, UpdateCustomerDto } from '../services/customer.service';
import { verifyToken, DecodedToken } from '../middlewares/auth';
import { authService } from '../services/auth.service';

const customerService = new CustomerService();

// GET /api/customer - Get all customers or search
export async function customerGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const url = new URL(request.url);
    const { searchParams } = url;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const withProjects = searchParams.get('withProjects');
    const company = searchParams.get('company');

    let customers;
    if (company) {
      customers = await customerService.getCustomersByCompany(company);
    } else if (status) {
      customers = await customerService.getCustomersByStatus(status);
    } else if (search) {
      customers = await customerService.searchCustomers(search);
    } else if (withProjects === 'true') {
      customers = await customerService.getCustomersWithProjects();
    } else {
      customers = await customerService.getAllCustomers();
    }

    return {
      status: 200,
      jsonBody: customers
    };

  } catch (error: any) {
    context.log('Get all customers error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve customers' }
    };
  }
}

// GET /api/customer/{id} - Get customer by ID
export async function customerGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return {
        status: 404,
        jsonBody: { error: 'Customer not found' }
      };
    }

    return {
      status: 200,
      jsonBody: customer
    };

  } catch (error: any) {
    context.log('Get customer by ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve customer' }
    };
  }
}

// POST /api/customer - Create new customer
export async function customerCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json() as CreateCustomerDto;
    
    // Validate required fields
    if (!body.name) {
      return {
        status: 400,
        jsonBody: { error: 'Customer name is required' }
      };
    }

    // Get current user from JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization token required' }
      };
    }

    const token = authHeader.substring(7);
    const decodedToken = verifyToken(token);
    
    if (!decodedToken || !decodedToken.userId) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    // Get current user with roles and company info
    const currentUser = await authService.getUserById(decodedToken.userId);
    if (!currentUser) {
      return {
        status: 401,
        jsonBody: { error: 'User not found' }
      };
    }

    // Determine company ID based on user role
    let companyId: string | undefined;
    if (currentUser) {
      const userRoles = currentUser.userRoles || [];
      const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
      
      if (isSuperAdmin) {
        // Se l'utente corrente è super admin, il nuovo customer viene associato alla sua società
        companyId = currentUser.company || currentUser.id;
      } else {
        // Se l'utente corrente non è super admin, il nuovo customer viene associato alla società dell'utente corrente
        companyId = currentUser.company || undefined;
      }
    }

    // Add company to the customer data
    const customerData = {
      ...body,
      company: companyId
    };

    const newCustomer = await customerService.createCustomer(customerData);
    return {
      status: 201,
      jsonBody: newCustomer
    };

  } catch (error: any) {
    context.log('Create customer error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create customer' }
    };
  }
}

// PUT /api/customer/{id} - Update customer
export async function customerUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Customer ID is required' }
      };
    }

    const body = await request.json() as UpdateCustomerDto;
    
    // Get current user from JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        jsonBody: { error: 'Authorization token required' }
      };
    }

    const token = authHeader.substring(7);
    const decodedToken = verifyToken(token);
    
    if (!decodedToken || !decodedToken.userId) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid token' }
      };
    }

    // Get current user with roles and company info
    const currentUser = await authService.getUserById(decodedToken.userId);
    if (!currentUser) {
      return {
        status: 401,
        jsonBody: { error: 'User not found' }
      };
    }

    // Determine company ID based on user role
    let companyId: string | undefined;
    if (currentUser) {
      const userRoles = currentUser.userRoles || [];
      const isSuperAdmin = userRoles.some((ur: any) => ur.name === 'superadmin');
      
      if (isSuperAdmin) {
        // Se l'utente corrente è super admin, il customer viene associato alla sua società
        companyId = currentUser.company || currentUser.id;
      } else {
        // Se l'utente corrente non è super admin, il customer viene associato alla società dell'utente corrente
        companyId = currentUser.company || undefined;
      }
    }

    // Add company to the customer data
    const customerData = {
      ...body,
      company: companyId
    };

    const updatedCustomer = await customerService.updateCustomer(id, customerData);
    
    return {
      status: 200,
      jsonBody: updatedCustomer
    };

  } catch (error: any) {
    context.log('Update customer error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update customer' }
    };
  }
}

// DELETE /api/customer/{id} - Delete customer
export async function customerDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    if (!id) {
      return {
        status: 400,
        jsonBody: { error: 'Customer ID is required' }
      };
    }

    await customerService.deleteCustomer(id);
    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete customer error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete customer' }
    };
  }
}

// HTTP Trigger Registrations
app.http('customerGetAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'customer',
  handler: customerGetAll
});

app.http('customerGetById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'customer/{id}',
  handler: customerGetById
});

app.http('customerCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'customer',
  handler: customerCreate
});

app.http('customerUpdate', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'customer/{id}',
  handler: customerUpdate
});

app.http('customerDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'customer/{id}',
  handler: customerDelete
});