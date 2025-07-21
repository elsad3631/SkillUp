import { 
  listFiles, 
  uploadFile, 
  deleteFile, 
  bulkDeleteFiles, 
  type FileListResponse, 
  type FileUploadResponse 
} from '@/core/services/businessServices/BlobStorage';

// Types for project documents
export interface ProjectFolder {
  name: string;
  files: ProjectFile[];
  subfolders: ProjectFolder[];
  path: string;
}

export interface ProjectFile {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  url?: string;
}

export interface FolderStructure {
  folders: ProjectFolder[];
  files: ProjectFile[];
}

// Project Documents Service
class ProjectDocumentsService {
  
  /**
   * Get prefix for project documents
   */
  private getProjectPrefix(projectId: string): string {
    return `projects/${projectId}/documents/`;
  }
  
  /**
   * Get all files and folders for a project
   */
  async getProjectDocuments(projectId: string, folderPath = ''): Promise<FolderStructure | null> {
    try {
      const prefix = this.getProjectPrefix(projectId) + folderPath;
      const result = await listFiles(prefix);
      
      if (!result) {
        return null;
      }
      
      return this.organizeFilesAndFolders(result.files, prefix);
    } catch (error) {
      console.error('Error getting project documents:', error);
      return null;
    }
  }
  
  /**
   * Organize files into folder structure
   */
  private organizeFilesAndFolders(files: any[], basePath: string): FolderStructure {
    const folders: ProjectFolder[] = [];
    const rootFiles: ProjectFile[] = [];
    const folderMap = new Map<string, ProjectFolder>();
    
    files.forEach(file => {
      // Remove base path to get relative path
      const relativePath = file.name.replace(basePath, '');
      const pathParts = relativePath.split('/').filter(part => part.length > 0);
      
      if (pathParts.length === 1) {
        // It's a file in the current directory
        rootFiles.push({
          name: pathParts[0],
          fullPath: file.name,
          size: file.size,
          contentType: file.contentType,
          lastModified: new Date(file.lastModified),
          etag: file.etag
        });
      } else if (pathParts.length > 1) {
        // It's a file in a subdirectory
        const folderName = pathParts[0];
        const folderPath = basePath + folderName + '/';
        
        if (!folderMap.has(folderName)) {
          folderMap.set(folderName, {
            name: folderName,
            files: [],
            subfolders: [],
            path: folderPath
          });
        }
        
        // Add file to folder
        const folder = folderMap.get(folderName)!;
        if (pathParts.length === 2) {
          folder.files.push({
            name: pathParts[1],
            fullPath: file.name,
            size: file.size,
            contentType: file.contentType,
            lastModified: new Date(file.lastModified),
            etag: file.etag
          });
        }
      }
    });
    
    return {
      folders: Array.from(folderMap.values()),
      files: rootFiles
    };
  }
  
  /**
   * Upload file to project folder
   */
  async uploadProjectFile(
    projectId: string, 
    file: File, 
    folderPath = '', 
    customName?: string,
    projectInfo?: { id: string; name?: string }
  ): Promise<FileUploadResponse | null> {
    try {
      const fullPath = this.getProjectPrefix(projectId) + folderPath;
      const fileName = customName || file.name;
      const fullFileName = fullPath + fileName;
      
      // Prepare metadata
      const metadata: Record<string, string> = {
        metadata_storage_name: fileName,
        metadata_creation_date: new Date().toISOString(),
        project_id: projectId,
        document_type: 'project_document'
      };
      
      // Add project name if available
      if (projectInfo?.name) {
        metadata.project_name = projectInfo.name;
      }
      
      const result = await uploadFile(file, '', fullFileName, metadata);
      return result || null;
    } catch (error) {
      console.error('Error uploading project file:', error);
      return null;
    }
  }
  
  /**
   * Create a folder (virtual folder - just the prefix)
   */
  async createProjectFolder(
    projectId: string, 
    folderName: string, 
    parentPath = '',
    projectInfo?: { id: string; name?: string }
  ): Promise<boolean> {
    try {
      // Create a placeholder file in the folder to make it "exist"
      const folderPath = this.getProjectPrefix(projectId) + parentPath + folderName + '/';
      const placeholderFile = new File([''], '.folder_placeholder', { type: 'text/plain' });
      
      // Prepare metadata
      const metadata: Record<string, string> = {
        metadata_storage_name: '.folder_placeholder',
        metadata_creation_date: new Date().toISOString(),
        project_id: projectId,
        document_type: 'project_folder_placeholder'
      };
      
      // Add project name if available
      if (projectInfo?.name) {
        metadata.project_name = projectInfo.name;
      }
      
      const result = await uploadFile(placeholderFile, '', folderPath + '.folder_placeholder', metadata);
      return !!result;
    } catch (error) {
      console.error('Error creating project folder:', error);
      return false;
    }
  }
  
  /**
   * Delete a file
   */
  async deleteProjectFile(projectId: string, filePath: string): Promise<boolean> {
    try {
      return await deleteFile(filePath);
    } catch (error) {
      console.error('Error deleting project file:', error);
      return false;
    }
  }
  
  /**
   * Delete a folder and all its contents
   */
  async deleteProjectFolder(projectId: string, folderPath: string): Promise<boolean> {
    try {
      const result = await listFiles(folderPath);
      if (!result || result.files.length === 0) {
        return true;
      }
      
      const fileNames = result.files.map(file => file.name);
      const deleteResult = await bulkDeleteFiles(fileNames);
      
      return deleteResult ? deleteResult.deleted === deleteResult.total : false;
    } catch (error) {
      console.error('Error deleting project folder:', error);
      return false;
    }
  }
  
  /**
   * Get file download URL
   */
  getFileDownloadUrl(fileName: string): string {
    const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
    return `${API_URL}/blobstorage/download/${encodeURIComponent(fileName)}`;
  }
  
  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const result = await listFiles(filePath);
      return result ? result.files.length > 0 : false;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }
  
  /**
   * Get file type icon class
   */
  getFileTypeIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    const iconMap: Record<string, string> = {
      pdf: 'fa-file-pdf text-danger',
      doc: 'fa-file-word text-primary',
      docx: 'fa-file-word text-primary',
      xls: 'fa-file-excel text-success',
      xlsx: 'fa-file-excel text-success',
      ppt: 'fa-file-powerpoint text-warning',
      pptx: 'fa-file-powerpoint text-warning',
      txt: 'fa-file-text text-muted',
      jpg: 'fa-file-image text-info',
      jpeg: 'fa-file-image text-info',
      png: 'fa-file-image text-info',
      gif: 'fa-file-image text-info',
      zip: 'fa-file-archive text-secondary',
      rar: 'fa-file-archive text-secondary',
      '7z': 'fa-file-archive text-secondary',
      mp4: 'fa-file-video text-danger',
      avi: 'fa-file-video text-danger',
      mp3: 'fa-file-audio text-success',
      wav: 'fa-file-audio text-success',
      css: 'fa-file-code text-info',
      js: 'fa-file-code text-warning',
      ts: 'fa-file-code text-primary',
      html: 'fa-file-code text-danger',
      xml: 'fa-file-code text-muted',
      json: 'fa-file-code text-success'
    };
    
    return iconMap[extension] || 'fa-file text-muted';
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
    return path.split('/').filter(part => part.length > 0);
  }
}

export const projectDocumentsService = new ProjectDocumentsService();

export default {
  getProjectDocuments: projectDocumentsService.getProjectDocuments.bind(projectDocumentsService),
  uploadProjectFile: projectDocumentsService.uploadProjectFile.bind(projectDocumentsService),
  createProjectFolder: projectDocumentsService.createProjectFolder.bind(projectDocumentsService),
  deleteProjectFile: projectDocumentsService.deleteProjectFile.bind(projectDocumentsService),
  deleteProjectFolder: projectDocumentsService.deleteProjectFolder.bind(projectDocumentsService),
  getFileDownloadUrl: projectDocumentsService.getFileDownloadUrl.bind(projectDocumentsService),
  fileExists: projectDocumentsService.fileExists.bind(projectDocumentsService),
  getFileTypeIcon: projectDocumentsService.getFileTypeIcon.bind(projectDocumentsService),
  formatFileSize: projectDocumentsService.formatFileSize.bind(projectDocumentsService),
  getBreadcrumb: projectDocumentsService.getBreadcrumb.bind(projectDocumentsService)
}; 