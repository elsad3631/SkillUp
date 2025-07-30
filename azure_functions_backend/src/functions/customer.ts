import { HttpRequest, InvocationContext, HttpResponseInit } from '@azure/functions';
import { CustomerService, CreateCustomerDto, UpdateCustomerDto } from '../services/customer.service';
import { verifyToken, DecodedToken } from '../middlewares/auth';

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

    let customers;
    if (status) {
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

    const newCustomer = await customerService.createCustomer(body);
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
    const updatedCustomer = await customerService.updateCustomer(id, body);
    
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