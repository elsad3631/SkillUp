import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { Project } from "@/core/models/Project";

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

const createProject = (formData: Project): Promise<Project | undefined> => {
  return ApiService.post(`projects`, formData)
    .then(({ data }) => data as Project)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateProject = (id: string, formData: Project): Promise<Project | undefined> => {
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

const createSkillRequirement = (projectId: string, skill: any): Promise<any> => {
  return ApiService.post(`skill-requirements`, { ...skill, projectId })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateSkillRequirement = (skillId: string, skill: any): Promise<any> => {
  return ApiService.put(`skill-requirements/${skillId}`, skill)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteSkillRequirement = (skillId: string): Promise<boolean> => {
  return ApiService.delete(`skill-requirements/${skillId}`)
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
  createSkillRequirement,
  updateSkillRequirement,
  deleteSkillRequirement
}; 