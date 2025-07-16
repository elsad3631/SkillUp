import ApiService from "@/core/services/ApiService";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();

// Types for blob storage operations
export interface FileUploadResponse {
  message: string;
  fileName: string;
  fileUrl: string;
  size: number;
  contentType: string;
}

export interface FileListResponse {
  files: Array<{
    name: string;
    size: number;
    contentType: string;
    lastModified: string;
    etag: string;
  }>;
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface FileInfo {
  fileName: string;
  exists: boolean;
  properties: {
    contentLength: number;
    contentType: string;
    lastModified: string;
    etag: string;
    metadata?: any;
  };
}

export interface BulkDeleteResponse {
  message: string;
  total: number;
  deleted: number;
  failed: number;
  results: Array<{
    fileName: string;
    deleted: boolean;
    error: string | null;
  }>;
}

/**
 * Initialize the blob storage container
 */
const initializeContainer = (): Promise<{ message: string } | undefined> => {
  return ApiService.post('blobstorage/container/init', {})
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Upload a single file
 */
const uploadFile = (file: File, prefix?: string, customName?: string): Promise<FileUploadResponse | undefined> => {
  const formData = new FormData();
  formData.append('file', file);
  if (prefix) formData.append('prefix', prefix);
  if (customName) formData.append('customName', customName);

  return ApiService.vueInstance.axios.post('blobstorage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(({ data }) => data as FileUploadResponse)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Upload multiple files
 */
const uploadMultipleFiles = (files: File[], prefix?: string): Promise<{ message: string; files: FileUploadResponse[]; count: number } | undefined> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  if (prefix) formData.append('prefix', prefix);

  return ApiService.vueInstance.axios.post('blobstorage/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Download a file
 */
const downloadFile = (fileName: string): Promise<Blob | undefined> => {
  return ApiService.vueInstance.axios.get(`blobstorage/download/${encodeURIComponent(fileName)}`, {
    responseType: 'blob',
  })
    .then(({ data }) => data as Blob)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Get file information
 */
const getFileInfo = (fileName: string): Promise<FileInfo | undefined> => {
  return ApiService.get(`blobstorage/info/${encodeURIComponent(fileName)}`)
    .then(({ data }) => data as FileInfo)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Check if file exists
 */
const fileExists = (fileName: string): Promise<{ fileName: string; exists: boolean } | undefined> => {
  return ApiService.get(`blobstorage/exists/${encodeURIComponent(fileName)}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Delete a file
 */
const deleteFile = (fileName: string): Promise<boolean> => {
  return ApiService.delete(`blobstorage/${encodeURIComponent(fileName)}`)
    .then(() => true)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return false;
    });
};

/**
 * Copy a file
 */
const copyFile = (sourceFileName: string, destinationFileName: string): Promise<{ message: string; sourceFileName: string; destinationFileName: string; destinationUrl: string } | undefined> => {
  return ApiService.post('blobstorage/copy', {
    sourceFileName,
    destinationFileName,
  })
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * List files with optional filtering and pagination
 */
const listFiles = (prefix?: string, limit = 100, offset = 0): Promise<FileListResponse | undefined> => {
  const params = new URLSearchParams();
  if (prefix) params.append('prefix', prefix);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  return ApiService.get(`blobstorage/list?${params.toString()}`)
    .then(({ data }) => data as FileListResponse)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Generate SAS URL for a file
 */
const generateSasUrl = (fileName: string, expiresInHours = 1): Promise<{ fileName: string; sasUrl: string; expiresInHours: number } | undefined> => {
  const params = new URLSearchParams();
  params.append('expiresInHours', expiresInHours.toString());

  return ApiService.get(`blobstorage/sas/${encodeURIComponent(fileName)}?${params.toString()}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Bulk delete files
 */
const bulkDeleteFiles = (fileNames: string[]): Promise<BulkDeleteResponse | undefined> => {
  return ApiService.post('blobstorage/bulk/delete', { fileNames })
    .then(({ data }) => data as BulkDeleteResponse)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

/**
 * Get storage statistics
 */
const getStorageStats = (prefix?: string): Promise<{
  totalFiles: number;
  totalSize: number;
  averageSize: number;
  fileTypes: Record<string, number>;
  oldestFile: { name: string; lastModified: string } | null;
  newestFile: { name: string; lastModified: string } | null;
} | undefined> => {
  const params = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
  
  return ApiService.get(`blobstorage/stats${params}`)
    .then(({ data }) => data)
    .catch(({ response }) => {
      store.setError(response.data.message || response.data.error, response.status);
      return undefined;
    });
};

export {
  initializeContainer,
  uploadFile,
  uploadMultipleFiles,
  downloadFile,
  getFileInfo,
  fileExists,
  deleteFile,
  copyFile,
  listFiles,
  generateSasUrl,
  bulkDeleteFiles,
  getStorageStats,
}; 