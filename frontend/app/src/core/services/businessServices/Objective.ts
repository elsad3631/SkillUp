import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { ObjectiveStatus, ObjectivePriority, ObjectiveCategory } from "@/core/models/enums";

const store = useAuthStore();

export interface Objective {
  id: string;
  title: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: Date;
  endDate: Date;
  status: ObjectiveStatus;
  priority: ObjectivePriority;
  assignedTo?: string;
  projectId?: string;
  category?: ObjectiveCategory;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
  assignedUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  project?: {
    id: string;
    name: string;
    status: string;
  };
}

const getObjectives = (): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("objective")
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectiveById = (id: string): Promise<Objective | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/${id}`)
    .then(({ data }) => data as Objective)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectivesByAssignee = (assigneeId: string): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/assignee/${assigneeId}`)
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectivesByProject = (projectId: string): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/project/${projectId}`)
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectivesByStatus = (status: string): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/status/${status}`)
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectivesByCategory = (category: string): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/category/${category}`)
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getOverdueObjectives = (): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("objective/overdue")
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUpcomingObjectives = (days: number = 30): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`objective/upcoming?days=${days}`)
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMyObjectives = (): Promise<Array<Objective> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("objective/my-objectives")
    .then(({ data }) => data as Objective[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createObjective = (objective: Partial<Objective>): Promise<Objective | undefined> => {
  ApiService.setHeader();
  return ApiService.post("objective", objective)
    .then(({ data }) => data as Objective)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateObjective = (id: string, objective: Partial<Objective>): Promise<Objective | undefined> => {
  ApiService.setHeader();
  return ApiService.update("objective", id, objective)
    .then(({ data }) => data as Objective)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteObjective = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`objective/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const updateObjectiveProgress = (id: string, progress: number): Promise<Objective | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`objective/${id}/progress`, { progress })
    .then(({ data }) => data as Objective)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateObjectiveValue = (id: string, currentValue: number): Promise<Objective | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`objective/${id}/value`, { currentValue })
    .then(({ data }) => data as Objective)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getObjectiveStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("objective/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAssigneeObjectiveStats = (assigneeId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`objective/stats/assignee/${assigneeId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getProjectObjectiveStats = (projectId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`objective/stats/project/${projectId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getObjectives,
  getObjectiveById,
  getObjectivesByAssignee,
  getObjectivesByProject,
  getObjectivesByStatus,
  getObjectivesByCategory,
  getOverdueObjectives,
  getUpcomingObjectives,
  getMyObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  updateObjectiveProgress,
  updateObjectiveValue,
  getObjectiveStats,
  getAssigneeObjectiveStats,
  getProjectObjectiveStats,
}; 