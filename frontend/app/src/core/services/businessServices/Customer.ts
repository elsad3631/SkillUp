import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { useAuthStore } from "@/stores/auth";
import type { Customer } from "@/core/models/Customer";

const store = useAuthStore();

const getAllCustomers = (): Promise<Array<Customer> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer`)
    .then(({ data }) => data as Customer[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCustomerById = (id: string): Promise<Customer | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer/${id}`)
    .then(({ data }) => data as Customer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createCustomer = (formData: Partial<Customer>): Promise<Customer | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`customer`, formData)
    .then(({ data }) => data as Customer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateCustomer = (id: string, formData: Partial<Customer>): Promise<Customer | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`customer/${id}`, formData)
    .then(({ data }) => data as Customer)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteCustomer = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`customer/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const searchCustomers = (query: string): Promise<Array<Customer> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer?search=${encodeURIComponent(query)}`)
    .then(({ data }) => data as Customer[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCustomersByStatus = (status: string): Promise<Array<Customer> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer?status=${encodeURIComponent(status)}`)
    .then(({ data }) => data as Customer[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCustomersWithProjects = (): Promise<Array<Customer> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer?withProjects=true`)
    .then(({ data }) => data as Customer[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCustomersByCompany = (companyId: string): Promise<Array<Customer> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`customer?company=${encodeURIComponent(companyId)}`)
    .then(({ data }) => data as Customer[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomersByStatus,
  getCustomersWithProjects,
  getCustomersByCompany
}; 