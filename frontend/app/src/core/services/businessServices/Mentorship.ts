import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { MentorshipStatus } from "@/core/models/enums";

const store = useAuthStore();

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  startDate: Date;
  endDate?: Date;
  status: MentorshipStatus;
  goals: string[];
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  mentor?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  mentee?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
}

const getMentorships = (): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("mentorship")
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorshipById = (id: string): Promise<Mentorship | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/${id}`)
    .then(({ data }) => data as Mentorship)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorshipsByMentor = (mentorId: string): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/mentor/${mentorId}`)
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorshipsByMentee = (menteeId: string): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/mentee/${menteeId}`)
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorshipsByStatus = (status: string): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/status/${status}`)
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getActiveMentorships = (): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("mentorship/active")
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCompletedMentorships = (): Promise<Array<Mentorship> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("mentorship/completed")
    .then(({ data }) => data as Mentorship[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createMentorship = (mentorship: Partial<Mentorship>): Promise<Mentorship | undefined> => {
  ApiService.setHeader();
  return ApiService.post("mentorship", mentorship)
    .then(({ data }) => data as Mentorship)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateMentorship = (id: string, mentorship: Partial<Mentorship>): Promise<Mentorship | undefined> => {
  ApiService.setHeader();
  return ApiService.update("mentorship", id, mentorship)
    .then(({ data }) => data as Mentorship)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteMentorship = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`mentorship/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const endMentorship = (id: string, feedback?: string, rating?: number): Promise<Mentorship | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`mentorship/${id}/end`, { feedback, rating })
    .then(({ data }) => data as Mentorship)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorshipStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("mentorship/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMentorStats = (mentorId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/stats/mentor/${mentorId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getMenteeStats = (menteeId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`mentorship/stats/mentee/${menteeId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getMentorships,
  getMentorshipById,
  getMentorshipsByMentor,
  getMentorshipsByMentee,
  getMentorshipsByStatus,
  getActiveMentorships,
  getCompletedMentorships,
  createMentorship,
  updateMentorship,
  deleteMentorship,
  endMentorship,
  getMentorshipStats,
  getMentorStats,
  getMenteeStats,
}; 