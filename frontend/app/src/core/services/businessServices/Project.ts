import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import type { Project } from "@/core/models/Project";

const store = useAuthStore();

const getProjects = (filterRequest?: string): Promise<Array<Project> | undefined> => {
  ApiService.setHeader();
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
  ApiService.setHeader();
  return ApiService.get(`projects/${id}`)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createProject = (formData: any): Promise<Project | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`projects`, formData)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateProject = (id: string, formData: any): Promise<Project | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`projects/${id}`, formData)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteProject = (id: string): Promise<boolean> => {
  ApiService.setHeader();
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
  
  return ApiService.query(`projects/user/my-projects`, {})
    .then(({ data }) => data as Project[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Nuove funzioni per le assegnazioni di progetti
const getEmployeeProjects = (employeeId: string): Promise<Array<Project> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`applicationuser/${employeeId}/projects`)
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
  ApiService.setHeader();
  return ApiService.post(`appointment`, assignmentData)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const removeProjectAssignment = (assignmentId: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`appointment/${assignmentId}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const updateProjectAssignment = (assignmentId: string, assignmentData: {
  roleOnProject?: string;
  assignmentStartDate?: string;
  assignmentEndDate?: string;
  allocationPercentage?: number;
  status?: string;
  feedbackReceived?: string;
}): Promise<any | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`appointment/${assignmentId}`, assignmentData)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
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
  removeProjectAssignment,
  updateProjectAssignment
}; 