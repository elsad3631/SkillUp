import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface ProjectSkill {
  id: string;
  name: string;
  minProficiencyLevel?: number; // For hard skills
  proficiencyLevel?: number; // For soft skills (like employee)
  certification?: string; // For both hard and soft skills
  isMandatory?: boolean;
  projectHardId?: string;
  projectSoftId?: string;
}

// Hard Skills Functions
const updateHardSkill = (id: string, formData: Partial<ProjectSkill>): Promise<ProjectSkill | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`project-skills/${id}`, formData)
    .then(({ data }) => data as ProjectSkill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteHardSkill = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`project-skills/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const createHardSkill = (formData: Partial<ProjectSkill>): Promise<ProjectSkill | undefined> => {
  ApiService.setHeader();
  return ApiService.post('project-skills/hard', formData)
    .then(({ data }) => data as ProjectSkill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getHardSkillsByProjectId = (projectId: string): Promise<ProjectSkill[]> => {
  ApiService.setHeader();
  return ApiService.get(`project-skills/hard/${projectId}`)
    .then(({ data }) => data as ProjectSkill[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return [];
    });
};

// Soft Skills Functions
const updateSoftSkill = (id: string, formData: Partial<ProjectSkill>): Promise<ProjectSkill | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`project-skills/${id}`, formData)
    .then(({ data }) => data as ProjectSkill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteSoftSkill = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`project-skills/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const createSoftSkill = (formData: Partial<ProjectSkill>): Promise<ProjectSkill | undefined> => {
  ApiService.setHeader();
  return ApiService.post('project-skills/soft', formData)
    .then(({ data }) => data as ProjectSkill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getSoftSkillsByProjectId = (projectId: string): Promise<ProjectSkill[]> => {
  ApiService.setHeader();
  return ApiService.get(`project-skills/soft/${projectId}`)
    .then(({ data }) => data as ProjectSkill[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return [];
    });
};

export {
  // Hard Skills
  updateHardSkill,
  deleteHardSkill,
  createHardSkill,
  getHardSkillsByProjectId,
  // Soft Skills
  updateSoftSkill,
  deleteSoftSkill,
  createSoftSkill,
  getSoftSkillsByProjectId
}; 