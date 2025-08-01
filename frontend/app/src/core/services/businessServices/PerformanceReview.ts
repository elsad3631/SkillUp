import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: string;
  reviewDate: string;
  overallScore?: number;
  technicalScore?: number;
  softSkillScore?: number;
  leadershipScore?: number;
  feedback?: string;
  strengths: string[];
  areasForImprovement: string[];
  goals?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'COMPLETED';
  nextReviewDate?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  reviewer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface PerformanceReviewStats {
  averageOverallScore: number;
  averageTechnicalScore: number;
  averageSoftSkillScore: number;
  averageLeadershipScore: number;
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
}

// Get all performance reviews
const getAllPerformanceReviews = (): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get('performance-review')
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get performance review by ID
const getPerformanceReviewById = (id: string): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/${id}`)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get performance reviews by employee ID
const getPerformanceReviewsByEmployee = (employeeId: string): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/employee/${employeeId}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get performance reviews by reviewer ID
const getPerformanceReviewsByReviewer = (reviewerId: string): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/reviewer/${reviewerId}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get performance reviews by status
const getPerformanceReviewsByStatus = (status: string): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/status/${status}`)
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get pending performance reviews
const getPendingPerformanceReviews = (): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get('performance-review/pending')
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get overdue performance reviews
const getOverduePerformanceReviews = (): Promise<PerformanceReview[] | undefined> => {
  ApiService.setHeader();
  return ApiService.get('performance-review/overdue')
    .then(({ data }) => data as PerformanceReview[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Create new performance review
const createPerformanceReview = (review: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.post('performance-review', review)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Update performance review
const updatePerformanceReview = (id: string, review: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.put(`performance-review/${id}`, review)
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Delete performance review
const deletePerformanceReview = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`performance-review/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

// Submit performance review for approval
const submitPerformanceReview = (id: string): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`performance-review/${id}/submit`, {})
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Approve performance review
const approvePerformanceReview = (id: string): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`performance-review/${id}/approve`, {})
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Complete performance review
const completePerformanceReview = (id: string): Promise<PerformanceReview | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`performance-review/${id}/complete`, {})
    .then(({ data }) => data as PerformanceReview)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Get employee performance stats
const getEmployeePerformanceStats = (employeeId: string): Promise<PerformanceReviewStats | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`performance-review/stats/employee/${employeeId}`)
    .then(({ data }) => data as PerformanceReviewStats)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getAllPerformanceReviews,
  getPerformanceReviewById,
  getPerformanceReviewsByEmployee,
  getPerformanceReviewsByReviewer,
  getPerformanceReviewsByStatus,
  getPendingPerformanceReviews,
  getOverduePerformanceReviews,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  submitPerformanceReview,
  approvePerformanceReview,
  completePerformanceReview,
  getEmployeePerformanceStats,
}; 