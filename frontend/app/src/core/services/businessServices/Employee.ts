import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { Employee } from "@/core/models/Employee";

const store = useAuthStore();

const getEmployees = (filterRequest?: string): Promise<Array<Employee> | undefined> => {
  const endpoint = filterRequest
    ? `employees?filter=${encodeURIComponent(filterRequest)}`
    : `employees`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as Employee[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEmployee = (id: string): Promise<Employee | undefined> => {
  return ApiService.get(`employees/${id}`)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createEmployee = (formData: Employee): Promise<Employee | undefined> => {
  return ApiService.post(`employees`, formData)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const updateEmployee = (id: string, formData: Employee): Promise<Employee | undefined> => {
  return ApiService.put(`employees/${id}`, formData)
    .then(({ data }) => data as Employee)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      throw new Error(response.data.message || response.data.error);
    });
};

const deleteEmployee = (id: string): Promise<boolean> => {
  return ApiService.delete(`employees/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
