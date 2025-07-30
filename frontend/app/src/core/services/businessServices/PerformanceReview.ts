import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { PerformanceReviewStatus, PerformanceReviewPeriod } from "@/core/models/enums";

const store = useAuthStore();

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: PerformanceReviewPeriod;
  reviewDate: Date;
  overallScore?: number;
  technicalScore?: number;
  softSkillScore?: number;
  leadershipScore?: number;
  feedback?: string;
  strengths: string[];
  areasForImprovement: string[];
  goals?: string;
  status: PerformanceReviewStatus;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  reviewer?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

const getPerformanceReviews = (): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("performance-review")
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPerformanceReviewById = (id: string): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/${id}`)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPerformanceReviewsByEmployee = (employeeId: string): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/employee/${employeeId}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPerformanceReviewsByReviewer = (reviewerId: string): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/reviewer/${reviewerId}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPerformanceReviewsByPeriod = (period: string): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/period/${period}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPerformanceReviewsByStatus = (status: string): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/status/${status}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUpcomingReviews = (days: number = 30): Promise<Array<PerformanceReview> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/upcoming?days=${days}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createPerformanceReview = (review: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.post("performance-review", review)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updatePerformanceReview = (id: string, review: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.update("performance-review", id, review)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deletePerformanceReview = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`performance-review/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getPerformanceReviewStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("performance-review/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEmployeePerformanceStats = (employeeId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/stats/employee/${employeeId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getReviewerPerformanceStats = (reviewerId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/stats/reviewer/${reviewerId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getPerformanceReviews,
  getPerformanceReviewById,
  getPerformanceReviewsByEmployee,
  getPerformanceReviewsByReviewer,
  getPerformanceReviewsByPeriod,
  getPerformanceReviewsByStatus,
  getUpcomingReviews,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  getPerformanceReviewStats,
  getEmployeePerformanceStats,
  getReviewerPerformanceStats,
}; 