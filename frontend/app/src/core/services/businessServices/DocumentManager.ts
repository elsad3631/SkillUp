import { 
  listFiles, 
  uploadFile, 
  deleteFile, 
  bulkDeleteFiles, 
  type FileListResponse, 
  type FileUploadResponse 
} from '@/core/services/businessServices/BlobStorage';
import { 
  getDocuments, 
  getDocumentById, 
  getDocumentsByUploader, 
  getDocumentsByUser,
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
  type Document 
} from '@/core/services/businessServices/Document';
import { DocumentCategory, DocumentMimeType } from '@/core/models/enums';

// Types for file management
export interface FileItem {
  id?: string; // Database ID if exists
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  url?: string;
  // Database fields
  documentId?: string;
  category?: DocumentCategory;
  tags?: string[];
  description?: string;
  isPublic?: boolean;
  uploadedBy?: string;
  userId?: string;
  projectId?: string;
}

export interface FolderItem {
  name: string;
  files: FileItem[];
  subfolders: FolderItem[];
  path: string;
}

export interface FolderStructure {
  folders: FolderItem[];
  files: FileItem[];
}

// Document Manager Service - Combines Storage + Database
class DocumentManagerService {
  
  /**
   * Get prefix for entity documents
   */
  private getEntityPrefix(entityType: string, entityId: string): string {
    return `${entityType}/${entityId}/documents/`;
  }
  
  /**
   * Get all files and folders for an entity (employee/project)
   */
  async getEntityDocuments(entityType: string, entityId: string, folderPath = ''): Promise<FolderStructure | null> {
    try {
      const prefix = this.getEntityPrefix(entityType, entityId) + folderPath;
      const storageResult = await listFiles(prefix);
      
      if (!storageResult) {
        return null;
      }
      
      // Get database records for this entity
      const dbDocuments = await this.getDatabaseDocuments(entityType, entityId);
      
      return this.organizeFilesAndFolders(storageResult.files, prefix, dbDocuments);
    } catch (error) {
      console.error('Error getting entity documents:', error);
      return null;
    }
  }
  
  /**
   * Get database documents for an entity
   */
  private async getDatabaseDocuments(entityType: string, entityId: string): Promise<Document[]> {
    try {
      if (entityType === 'employees') {
        return await getDocumentsByUploader(entityId) || [];
      } else if (entityType === 'projects') {
        return await getDocumentsByProject(entityId) || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting database documents:', error);
      return [];
    }
  }
  
  /**
   * Check if a file is a placeholder file that should be hidden
   */
  private isPlaceholderFile(fileName: string): boolean {
    // List of files that should be hidden from the UI
    const placeholderFiles = [
      '.gitkeep',
      '.folder',
      '.placeholder',
      '.gitignore',
      'Thumbs.db',
      '.DS_Store'
    ];
    
    return placeholderFiles.some(placeholder => fileName === placeholder);
  }

  /**
   * Organize files into folder structure with database metadata
   */
  private organizeFilesAndFolders(files: any[], basePath: string, dbDocuments: Document[]): FolderStructure {
    const folders: FolderItem[] = [];
    const rootFiles: FileItem[] = [];
    const folderMap = new Map<string, FolderItem>();
    
    // Create a map of database documents by file path
    const dbDocumentMap = new Map<string, Document>();
    dbDocuments.forEach(doc => {
      if (doc.fileUrl) {
        const fileName = doc.fileUrl.split('/').pop();
        if (fileName) {
          dbDocumentMap.set(fileName, doc);
        }
      }
    });
    
    files.forEach(file => {
      // Remove base path to get relative path
      const relativePath = file.name.replace(basePath, '');
      const pathParts = relativePath.split('/').filter(part => part.length > 0);
      
      // Get the file name for database lookup
      const fileName = pathParts[pathParts.length - 1];
      
      // Find corresponding database record
      const dbDoc = dbDocumentMap.get(fileName);
      
      const fileItem: FileItem = {
        id: dbDoc?.id,
        name: pathParts[pathParts.length - 1],
        fullPath: file.name,
        size: file.size,
        contentType: file.contentType,
        lastModified: new Date(file.lastModified),
        etag: file.etag,
        // Database fields
        documentId: dbDoc?.id,
        category: dbDoc?.category,
        tags: dbDoc?.tags || [],
        description: dbDoc?.description,
        isPublic: dbDoc?.isPublic || false,
        uploadedBy: dbDoc?.uploadedBy,
        userId: dbDoc?.userId,
        projectId: dbDoc?.projectId
      };
      
      if (pathParts.length === 1) {
        // It's a file in the current directory (skip placeholder files)
        if (!this.isPlaceholderFile(fileItem.name)) {
          rootFiles.push(fileItem);
        }
      } else if (pathParts.length > 1) {
        // It's a file in a subdirectory
        const folderName = pathParts[0];
        const folderPath = basePath + folderName + '/';
        
        // Always create the folder (even if it only contains placeholder files)
        if (!folderMap.has(folderName)) {
          folderMap.set(folderName, {
            name: folderName,
            files: [],
            subfolders: [],
            path: folderPath
          });
        }
        
        // Add file to folder (skip placeholder files)
        const folder = folderMap.get(folderName)!;
        if (!this.isPlaceholderFile(fileItem.name)) {
          folder.files.push(fileItem);
        }
      }
    });
    
    // Convert folder map to array
    folders.push(...folderMap.values());
    
    return { folders, files: rootFiles };
  }
  
  /**
   * Upload file to storage and save metadata to database
   */
  async uploadEntityFile(
    entityType: string,
    entityId: string,
    file: File,
    folderPath = '',
    customName?: string,
    metadata?: {
      category?: DocumentCategory;
      tags?: string[];
      description?: string;
      isPublic?: boolean;
      uploadedBy?: string;
      userId?: string;
      projectId?: string;
    }
  ): Promise<FileUploadResponse | null> {
    try {
      // Upload to storage
      const prefix = this.getEntityPrefix(entityType, entityId) + folderPath;
      const storageResult = await uploadFile(file, prefix, customName);
      
      if (!storageResult) {
        return null;
      }
      
      // Save metadata to database
      const documentData = {
        fileName: storageResult.fileName,
        originalFileName: file.name,
        fileUrl: storageResult.fileUrl,
        fileSize: file.size,
        mimeType: file.type as DocumentMimeType,
        uploadedBy: metadata?.uploadedBy || entityId,
        userId: metadata?.userId,
        projectId: metadata?.projectId,
        category: metadata?.category,
        tags: metadata?.tags || [],
        isPublic: metadata?.isPublic || false,
        description: metadata?.description
      };
      
      const dbDocument = await createDocument(documentData);
      
      return storageResult;
    } catch (error) {
      console.error('Error uploading entity file:', error);
      return null;
    }
  }
  
  /**
   * Create folder (storage only, no database record needed)
   */
  async createEntityFolder(
    entityType: string,
    entityId: string,
    folderName: string,
    parentPath = '',
    metadata?: any
  ): Promise<boolean> {
    try {
      const prefix = this.getEntityPrefix(entityType, entityId) + parentPath;
      const folderPath = prefix + folderName + '/';
      
      // Create a placeholder file to represent the folder
      const placeholderBlob = new Blob([''], { type: 'text/plain' });
      const placeholderFile = new File([placeholderBlob], '.folder', { type: 'text/plain' });
      
      const result = await uploadFile(placeholderFile, folderPath);
      
      if (result) {
        // Create database record for the folder
        try {
          const documentData = {
            fileName: '.folder',
            originalFileName: folderName,
            fileUrl: folderPath,
            fileSize: 0,
            mimeType: 'folder' as any,
            uploadedBy: metadata?.id || entityId,
            userId: entityType === 'employees' ? entityId : undefined,
            projectId: entityType === 'projects' ? entityId : undefined,
            category: 'folder' as any,
            tags: ['folder'],
            isPublic: false,
            description: `Folder: ${folderName}`,
          };
          
          await createDocument(documentData);
        } catch (dbError) {
          console.error('Error creating database record for folder:', dbError);
          // Continue even if database creation fails
        }
      }
      
      return result !== null;
    } catch (error) {
      console.error('Error creating entity folder:', error);
      return false;
    }
  }
  
  /**
   * Delete file from storage and database
   */
  async deleteEntityFile(entityType: string, entityId: string, filePath: string, documentId?: string): Promise<boolean> {
    try {
      
      // Delete from storage
      const storageResult = await deleteFile(filePath);
      
      if (!storageResult) {
        return false;
      }
      
      // Delete from database using document ID if provided
      if (documentId) {
        try {
          await deleteDocument(documentId);
        } catch (error) {
          console.error('Error deleting document from database:', error);
          // Continue even if database deletion fails
        }
      } else {
        // Fallback: Find and delete from database (legacy method)
        console.warn('No document ID provided, using fallback method to find document');
        let documents;
        if (entityType === 'employees') {
          documents = await getDocumentsByUser(entityId);
          if (!documents || documents.length === 0) {
            documents = await getDocumentsByUploader(entityId);
          }
        } else if (entityType === 'projects') {
          documents = await getDocumentsByProject(entityId);
        } else {
          documents = await getDocumentsByUploader(entityId);
        }
        
        if (documents && documents.length > 0) {
          const document = documents.find(doc => {
            if (doc.fileUrl === filePath) {
              return true;
            }
            const fileName = filePath.split('/').pop();
            if (fileName && doc.fileName === fileName) {
              if (entityType === 'employees' && doc.userId === entityId) {
                return true;
              }
              if (entityType === 'projects' && doc.projectId === entityId) {
                return true;
              }
            }
            return false;
          });
          
          if (document) {
            await deleteDocument(document.id);
          } else {
            console.warn(`No database record found for file: ${filePath}`);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting entity file:', error);
      return false;
    }
  }
  
  /**
   * Delete folder and all contents
   */
  async deleteEntityFolder(entityType: string, entityId: string, folderPath: string): Promise<boolean> {
    try {
      
      // Check if folderPath already includes the entity prefix
      const entityPrefix = this.getEntityPrefix(entityType, entityId);
      let prefix: string;
      
      if (folderPath.startsWith(entityPrefix)) {
        // folderPath already includes the full prefix, use it as is
        prefix = folderPath;
      } else {
        // folderPath is relative, add the entity prefix
        prefix = entityPrefix + folderPath;
      }
      
      const result = await listFiles(prefix);
      
      if (!result) {
        return false;
      }
      
      
      // Delete all files using full path
      const deletePromises = result.files.map(file => {
        return deleteFile(file.name);
      });
      const results = await Promise.all(deletePromises);
      
      
      // Delete database records for files in this folder
      let documents;
      if (entityType === 'employees') {
        documents = await getDocumentsByUser(entityId);
        if (!documents || documents.length === 0) {
          documents = await getDocumentsByUploader(entityId);
        }
      } else if (entityType === 'projects') {
        documents = await getDocumentsByProject(entityId);
      } else {
        documents = await getDocumentsByUploader(entityId);
      }
      
      if (documents && documents.length > 0) {
        // Delete records for files in this folder
        const folderDocuments = documents.filter(doc => 
          doc.fileUrl && doc.fileUrl.includes(folderPath)
        );
        
        
        const dbDeletePromises = folderDocuments.map(doc => {
          return deleteDocument(doc.id);
        });
        await Promise.all(dbDeletePromises);
        
        // Also delete the folder record itself (if it exists and wasn't already deleted)
        const folderRecord = documents.find(doc => 
          doc.fileUrl === folderPath && doc.fileName === '.folder' && 
          !folderDocuments.some(folderDoc => folderDoc.id === doc.id)
        );
        
        if (folderRecord) {
          await deleteDocument(folderRecord.id);
        }
      }
      
      const success = results.every(result => result);
      return success;
    } catch (error) {
      console.error('Error deleting entity folder:', error);
      return false;
    }
  }
  
  /**
   * Get file download URL
   */
  getFileDownloadUrl(filePath: string): string {
    const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
    return `${API_URL}/blobstorage/download/${encodeURIComponent(filePath)}`;
  }
  
  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const result = await listFiles(filePath);
      return result !== null && result !== undefined && result.files && result.files.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get file type icon
   */
  getFileTypeIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'fas fa-file-powerpoint text-warning';
      case 'txt':
        return 'fas fa-file-alt text-muted';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image text-info';
      case 'zip':
      case 'rar':
        return 'fas fa-file-archive text-secondary';
      default:
        return 'fas fa-file text-muted';
    }
  }
  
  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Get breadcrumb from path
   */
  getBreadcrumb(path: string): string[] {
    if (!path) return [];
    return path.split('/').filter(part => part.length > 0);
  }
  
  /**
   * Get document statistics
   */
  async getDocumentStats(entityType: string, entityId: string): Promise<any> {
    try {
      if (entityType === 'employees') {
        return await getDocumentStatsByUploader(entityId);
      } else if (entityType === 'projects') {
        return await getDocumentStatsByProject(entityId);
      }
      return null;
    } catch (error) {
      console.error('Error getting document stats:', error);
      return null;
    }
  }
}

// Create singleton instance
export const documentManagerService = new DocumentManagerService(); 