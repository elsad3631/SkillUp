import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { useAuthStore } from "@/stores/auth";
import type { Employee } from "@/core/models/Employee";

const store = useAuthStore();

const getEmployees = (filterRequest?: string): Promise<Array<Employee> | undefined> => {
  ApiService.setHeader();
  const endpoint = filterRequest
    ? `applicationuser?filter=${encodeURIComponent(filterRequest)}`
    : `applicationuser`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as Employee[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEmployee = (id: string): Promise<Employee | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`applicationuser/${id}`)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createEmployee = (formData: Employee): Promise<Employee | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`applicationuser`, formData)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateEmployee = (id: string, formData: Employee): Promise<Employee | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`applicationuser/${id}`, formData)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteEmployee = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`applicationuser/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const extractCVData = (cvFile: File, userId?: string, roles?: string[], company?: string): Promise<any> => {
  const data = new FormData();
  data.append('cv', cvFile);
  
  // Add roles to form data if provided
  if (roles && roles.length > 0) {
    data.append('roles', JSON.stringify(roles));
  }
  
  // Add company to form data if provided
  if (company) {
    data.append('company', company);
  }
  
  // Use axios directly for this specific case since we need custom headers
  return ApiService.vueInstance.axios.post('ExtractCVData', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${JwtService.getToken()}`,
      'Accept': 'application/json',
      'x-user-id': userId || ''
    }
  })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  extractCVData
};
