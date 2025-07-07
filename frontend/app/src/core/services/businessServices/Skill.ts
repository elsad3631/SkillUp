import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface Skill {
  id: string;
  name: string;
  proficiencyLevel?: number;
  certification?: string;
  employeeHardId?: string;
  employeeSoftId?: string;
}

const updateSkill = (id: string, formData: Partial<Skill>): Promise<Skill | undefined> => {
  return ApiService.put(`skills/${id}`, formData)
    .then(({ data }) => data as Skill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteSkill = (id: string): Promise<boolean> => {
  return ApiService.delete(`skills/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const createSkill = (formData: Partial<Skill>): Promise<Skill | undefined> => {
  return ApiService.post('skills', formData)
    .then(({ data }) => data as Skill)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  updateSkill,
  deleteSkill,
  createSkill
}; 