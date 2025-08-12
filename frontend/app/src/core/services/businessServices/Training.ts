import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { TrainingEnrollmentStatus, TrainingDifficulty, TrainingCategory } from "@/core/models/enums";

const store = useAuthStore();

export interface TrainingEnrollment {
  id: string;
  userId: string;
  trainingId: string;
  enrollmentDate: Date;
  completionDate?: Date;
  status: TrainingEnrollmentStatus;
  progress: number;
  score?: number;
  certificateUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  training?: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    difficulty: TrainingDifficulty;
    category: TrainingCategory;
  };
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuingAuthority: string;
  certificateNumber?: string;
  issueDate: Date;
  expiryDate?: Date;
  status: string;
  credentialUrl?: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
}

export interface Training {
  id: string;
  title: string;
  description?: string;
  provider?: string;
  url?: string;
  estimatedDurationHours: number;
  skillsDeveloped: string[];
  level?: string;
  cost?: number;
}

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  currentRole?: string;
  department?: string;
}

// Training Enrollment Services
const getTrainingEnrollments = (): Promise<Array<TrainingEnrollment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("training-enrollment")
    .then(({ data }) => data as TrainingEnrollment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTrainingEnrollmentById = (id: string): Promise<TrainingEnrollment | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`training-enrollment/${id}`)
    .then(({ data }) => data as TrainingEnrollment)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTrainingEnrollmentsByUser = (userId: string): Promise<Array<TrainingEnrollment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`training-enrollment/user/${userId}`)
    .then(({ data }) => data as TrainingEnrollment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTrainingEnrollmentsByStatus = (status: string): Promise<Array<TrainingEnrollment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`training-enrollment/status/${status}`)
    .then(({ data }) => data as TrainingEnrollment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTrainingEnrollmentsByTraining = (trainingId: string): Promise<Array<TrainingEnrollment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`training-enrollment/training/${trainingId}`)
    .then(({ data }) => data as TrainingEnrollment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCompletedTrainings = (): Promise<Array<TrainingEnrollment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("training-enrollment/completed")
    .then(({ data }) => data as TrainingEnrollment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createTrainingEnrollment = (enrollment: Partial<TrainingEnrollment>): Promise<TrainingEnrollment | undefined> => {
  ApiService.setHeader();
  return ApiService.post("training-enrollment", enrollment)
    .then(({ data }) => data as TrainingEnrollment)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateTrainingEnrollment = (id: string, enrollment: Partial<TrainingEnrollment>): Promise<TrainingEnrollment | undefined> => {
  ApiService.setHeader();
  return ApiService.update("training-enrollment", id, enrollment)
    .then(({ data }) => data as TrainingEnrollment)
    .catch((error) => {
      console.error('Error updating training enrollment:', error);
      const response = error.response;
      if (response) {
        const errorMessage = response.data?.message || response.data?.error || 'Unknown error occurred';
        store.setError(errorMessage, response.status);
      } else {
        store.setError('Network error or request failed', 500);
      }
      return undefined;
    });
};

const deleteTrainingEnrollment = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`training-enrollment/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getTrainingEnrollmentStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("training-enrollment/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Training Services
const getTrainings = (): Promise<Array<Training> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("skill-trainings")
    .then(({ data }) => data as Training[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getTrainingById = (id: string): Promise<Training | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`skill-trainings/${id}`)
    .then(({ data }) => data as Training)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createTraining = (training: Partial<Training>): Promise<Training | undefined> => {
  ApiService.setHeader();
  return ApiService.post("skill-trainings", training)
    .then(({ data }) => data as Training)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateTraining = (id: string, training: Partial<Training>): Promise<Training | undefined> => {
  ApiService.setHeader();
  return ApiService.update("skill-trainings", id, training)
    .then(({ data }) => data as Training)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteTraining = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`skill-trainings/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

// User Services
const getUsers = (): Promise<Array<User> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("applicationuser")
    .then(({ data }) => data as User[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

// Certification Services
const getCertifications = (): Promise<Array<Certification> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("certification")
    .then(({ data }) => data as Certification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCertificationById = (id: string): Promise<Certification | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`certification/${id}`)
    .then(({ data }) => data as Certification)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCertificationsByUser = (userId: string): Promise<Array<Certification> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`certification/user/${userId}`)
    .then(({ data }) => data as Certification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCertificationsByOrganization = (organization: string): Promise<Array<Certification> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`certification/organization/${organization}`)
    .then(({ data }) => data as Certification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getExpiringCertifications = (days: number = 30): Promise<Array<Certification> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`certification/expiring?days=${days}`)
    .then(({ data }) => data as Certification[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createCertification = (certification: Partial<Certification>): Promise<Certification | undefined> => {
  ApiService.setHeader();
  return ApiService.post("certification", certification)
    .then(({ data }) => data as Certification)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateCertification = (id: string, certification: Partial<Certification>): Promise<Certification | undefined> => {
  ApiService.setHeader();
  return ApiService.update("certification", id, certification)
    .then(({ data }) => data as Certification)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteCertification = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`certification/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getCertificationStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("certification/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getUserCertificationStats = (userId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`certification/stats/user/${userId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  // Training Enrollment
  getTrainingEnrollments,
  getTrainingEnrollmentById,
  getTrainingEnrollmentsByUser,
  getTrainingEnrollmentsByStatus,
  getTrainingEnrollmentsByTraining,
  getCompletedTrainings,
  createTrainingEnrollment,
  updateTrainingEnrollment,
  deleteTrainingEnrollment,
  getTrainingEnrollmentStats,
  // Training
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  // User
  getUsers,
  // Certification
  getCertifications,
  getCertificationById,
  getCertificationsByUser,
  getCertificationsByOrganization,
  getExpiringCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificationStats,
  getUserCertificationStats,
}; 