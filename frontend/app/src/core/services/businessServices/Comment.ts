import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

export interface Comment {
  id: string;
  content: string;
  entityType: string;
  entityId: string;
  authorId: string;
  parentCommentId?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  parentComment?: Comment;
  replies?: Comment[];
}

const getComments = (): Promise<Array<Comment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("comment")
    .then(({ data }) => data as Comment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCommentById = (id: string): Promise<Comment | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`comment/${id}`)
    .then(({ data }) => data as Comment)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCommentsByEntity = (entityType: string, entityId: string): Promise<Array<Comment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`comment/entity/${entityType}/${entityId}`)
    .then(({ data }) => data as Comment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCommentsByAuthor = (authorId: string): Promise<Array<Comment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`comment/author/${authorId}`)
    .then(({ data }) => data as Comment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getCommentReplies = (commentId: string): Promise<Array<Comment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`comment/${commentId}/replies`)
    .then(({ data }) => data as Comment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getPublicComments = (): Promise<Array<Comment> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("comment/public")
    .then(({ data }) => data as Comment[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createComment = (comment: Partial<Comment>): Promise<Comment | undefined> => {
  ApiService.setHeader();
  return ApiService.post("comment", comment)
    .then(({ data }) => data as Comment)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateComment = (id: string, comment: Partial<Comment>): Promise<Comment | undefined> => {
  ApiService.setHeader();
  return ApiService.update("comment", id, comment)
    .then(({ data }) => data as Comment)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteComment = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`comment/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const getCommentStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("comment/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getAuthorCommentStats = (authorId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`comment/stats/author/${authorId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getEntityCommentStats = (entityType: string, entityId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`comment/stats/entity/${entityType}/${entityId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getComments,
  getCommentById,
  getCommentsByEntity,
  getCommentsByAuthor,
  getCommentReplies,
  getPublicComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentStats,
  getAuthorCommentStats,
  getEntityCommentStats,
}; 