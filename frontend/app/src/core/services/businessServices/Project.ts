import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import type { Project } from "@/core/models/Project";

const store = useAuthStore();

const getProjects = (filterRequest?: string): Promise<Array<Project> | undefined> => {
  const endpoint = filterRequest
    ? `projects?filter=${encodeURIComponent(filterRequest)}`
    : `projects`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as Project[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getProject = (id: string): Promise<Project | undefined> => {
  return ApiService.get(`projects/${id}`)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createProject = (formData: any): Promise<Project | undefined> => {
  return ApiService.post(`projects`, formData)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateProject = (id: string, formData: any): Promise<Project | undefined> => {
  return ApiService.put(`projects/${id}`, formData)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteProject = (id: string): Promise<boolean> => {
  return ApiService.delete(`projects/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getUserProjects = (): Promise<Array<Project> | undefined> => {
  // Imposta l'header di autenticazione prima della chiamata
  ApiService.setHeader();
  
  return ApiService.query(`projects/my-projects`, {})
    .then(({ data }) => data as Project[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Nuove funzioni per le assegnazioni di progetti
const getEmployeeProjects = (employeeId: string): Promise<Array<Project> | undefined> => {
  return ApiService.get(`applicationusers/${employeeId}/projects`)
    .then(({ data }) => data as Project[])
    .catch(({ response }) => {
      console.error("Error getting employee projects:", response);
      // Fallback: ottieni tutti i progetti dell'utente corrente se l'endpoint specifico non esiste
      return getUserProjects();
    });
};

const assignProjectToEmployee = (assignmentData: {
  applicationUserId: string;
  projectId: string;
  roleOnProject: string;
  assignmentStartDate: string;
  assignmentEndDate?: string;
  allocationPercentage: number;
  status: string;
}): Promise<any | undefined> => {
  return ApiService.post(`appointments`, assignmentData)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const removeProjectAssignment = (assignmentId: string): Promise<boolean> => {
  return ApiService.delete(`appointments/${assignmentId}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getUserProjects,
  getEmployeeProjects,
  assignProjectToEmployee,
  removeProjectAssignment
}; 