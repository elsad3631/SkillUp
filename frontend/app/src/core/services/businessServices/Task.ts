import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { TaskStatus, TaskPriority } from "@/core/models/enums";

const store = useAuthStore();

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  projectId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
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

const getTasks = (): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("task")
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTaskById = (id: string): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/${id}`)
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTasksByAssignee = (assigneeId: string): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/assigned/${assigneeId}`)
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTasksByProject = (projectId: string): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/project/${projectId}`)
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTasksByStatus = (status: string): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/status/${status}`)
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTasksByPriority = (priority: string): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/priority/${priority}`)
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getOverdueTasks = (): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("task/overdue")
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUpcomingTasks = (days: number = 7): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`task/due-soon?days=${days}`)
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMyTasks = (): Promise<Array<Task> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("task/assigned/me")
    .then(({ data }) => data as Task[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createTask = (task: Partial<Task>): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.post("task", task)
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateTask = (id: string, task: Partial<Task>): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.update("task", id, task)
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteTask = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`task/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const assignTask = (taskId: string, assigneeId: string): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`task/${taskId}/assign`, { assignedTo: assigneeId })
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateTaskStatus = (taskId: string, status: string): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`task/${taskId}/status`, { status })
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateTaskProgress = (taskId: string, progress: number): Promise<Task | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`task/${taskId}/progress`, { progress })
    .then(({ data }) => data as Task)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTaskStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("task/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAssigneeTaskStats = (assigneeId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`task/stats/user/${assigneeId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getProjectTaskStats = (projectId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`task/stats/project/${projectId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getTasks,
  getTaskById,
  getTasksByAssignee,
  getTasksByProject,
  getTasksByStatus,
  getTasksByPriority,
  getOverdueTasks,
  getUpcomingTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  updateTaskProgress,
  getTaskStats,
  getAssigneeTaskStats,
  getProjectTaskStats,
}; 