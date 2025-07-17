import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  technologiesUsed: string[];
  employeeId: string;
  employee?: any;
}

const getExperiences = (filterRequest?: string): Promise<Array<Experience> | undefined> => {
  ApiService.setHeader();
  const endpoint = filterRequest
    ? `experiences?filter=${encodeURIComponent(filterRequest)}`
    : `experiences`;

  return ApiService.get(endpoint)
    .then(({ data }) => data as Experience[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getExperience = (id: string): Promise<Experience | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`experiences/${id}`)
    .then(({ data }) => data as Experience)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createExperience = (formData: Partial<Experience>): Promise<Experience | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`experiences`, formData)
    .then(({ data }) => data as Experience)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateExperience = (id: string, formData: Partial<Experience>): Promise<Experience | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`experiences/${id}`, formData)
    .then(({ data }) => data as Experience)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteExperience = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`experiences/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

export {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
}; 