import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { DocumentCategory, DocumentMimeType } from "@/core/models/enums";

const store = useAuthStore();

export interface Document {
  id: string;
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: DocumentMimeType;
  uploadedBy: string;
  userId?: string;
  projectId?: string;
  category?: DocumentCategory;
  tags: string[];
  isPublic: boolean;
  description?: string;
  uploadedAt: Date;
  uploadedByUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentRole?: string;
    department?: string;
  };
  user?: {
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

const getDocuments = (): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get("document")
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentById = (id: string): Promise<Document | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/${id}`)
    .then(({ data }) => data as Document)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentsByUploader = (uploaderId: string): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/uploader/${uploaderId}`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentsByProject = (projectId: string): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/project/${projectId}`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentsByType = (type: string): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/type/${type}`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getRecentDocuments = (days: number = 30): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/recent?days=${days}`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getLargeDocuments = (sizeMB: number = 10): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/large?sizeMB=${sizeMB}`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createDocument = (document: Partial<Document>): Promise<Document | undefined> => {
  ApiService.setHeader();
  return ApiService.post("document", document)
    .then(({ data }) => data as Document)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const updateDocument = (id: string, document: Partial<Document>): Promise<Document | undefined> => {
  ApiService.setHeader();
  return ApiService.update("document", id, document)
    .then(({ data }) => data as Document)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const deleteDocument = (id: string): Promise<boolean> => {
  ApiService.setHeader();
  return ApiService.delete(`document/${id}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

const generateDownloadUrl = (id: string): Promise<{ downloadUrl: string } | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`document/${id}/download`, {})
    .then(({ data }) => data as { downloadUrl: string })
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const generateShareUrl = (id: string, expiryHours: number = 24): Promise<{ shareUrl: string } | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`document/${id}/share`, { expiryHours })
    .then(({ data }) => data as { shareUrl: string })
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const createDocumentVersion = (id: string, versionData: any): Promise<Document | undefined> => {
  ApiService.setHeader();
  return ApiService.post(`document/${id}/version`, versionData)
    .then(({ data }) => data as Document)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentVersions = (id: string): Promise<Array<Document> | undefined> => {
  ApiService.setHeader();
  return ApiService.get(`document/${id}/versions`)
    .then(({ data }) => data as Document[])
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentStats = (): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get("document/stats")
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentStatsByUploader = (uploaderId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`document/stats/uploader/${uploaderId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

const getDocumentStatsByProject = (projectId: string): Promise<any> => {
  ApiService.setHeader();
  return ApiService.get(`document/stats/project/${projectId}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  getDocuments,
  getDocumentById,
  getDocumentsByUploader,
  getDocumentsByProject,
  getDocumentsByType,
  getRecentDocuments,
  getLargeDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  generateDownloadUrl,
  generateShareUrl,
  createDocumentVersion,
  getDocumentVersions,
  getDocumentStats,
  getDocumentStatsByUploader,
  getDocumentStatsByProject,
}; 