import { 
  listFiles, 
  uploadFile, 
  deleteFile, 
  bulkDeleteFiles, 
  type FileListResponse, 
  type FileUploadResponse 
} from '@/core/services/businessServices/BlobStorage';

// Types for employee documents
export interface EmployeeFolder {
  name: string;
  files: EmployeeFile[];
  subfolders: EmployeeFolder[];
  path: string;
}

export interface EmployeeFile {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  url?: string;
}

export interface FolderStructure {
  folders: EmployeeFolder[];
  files: EmployeeFile[];
}

// Employee Documents Service
class EmployeeDocumentsService {
  
  /**
   * Get prefix for employee documents
   */
  private getEmployeePrefix(employeeId: string): string {
    return `employees/${employeeId}/documents/`;
  }
  
  /**
   * Get all files and folders for an employee
   */
  async getEmployeeDocuments(employeeId: string, folderPath = ''): Promise<FolderStructure | null> {
    try {
      const prefix = this.getEmployeePrefix(employeeId) + folderPath;
      const result = await listFiles(prefix);
      
      if (!result) {
        return null;
      }
      
      return this.organizeFilesAndFolders(result.files, prefix);
    } catch (error) {
      console.error('Error getting employee documents:', error);
      return null;
    }
  }
  
  /**
   * Organize files into folder structure
   */
  private organizeFilesAndFolders(files: any[], basePath: string): FolderStructure {
    const folders: EmployeeFolder[] = [];
    const rootFiles: EmployeeFile[] = [];
    const folderMap = new Map<string, EmployeeFolder>();
    
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
   * Upload file to employee folder
   */
  async uploadEmployeeFile(
    employeeId: string, 
    file: File, 
    folderPath = '', 
    customName?: string
  ): Promise<FileUploadResponse | null> {
    try {
      const fullPath = this.getEmployeePrefix(employeeId) + folderPath;
      const fileName = customName || file.name;
      const fullFileName = fullPath + fileName;
      
      const result = await uploadFile(file, '', fullFileName);
      return result || null;
    } catch (error) {
      console.error('Error uploading employee file:', error);
      return null;
    }
  }
  
  /**
   * Create a folder (virtual folder - just the prefix)
   */
  async createEmployeeFolder(
    employeeId: string, 
    folderName: string, 
    parentPath = ''
  ): Promise<boolean> {
    try {
      // Create a placeholder file in the folder to make it "exist"
      const folderPath = this.getEmployeePrefix(employeeId) + parentPath + folderName + '/';
      const placeholderFile = new File([''], '.folder_placeholder', { type: 'text/plain' });
      
      const result = await uploadFile(placeholderFile, '', folderPath + '.folder_placeholder');
      return !!result;
    } catch (error) {
      console.error('Error creating employee folder:', error);
      return false;
    }
  }
  
  /**
   * Delete a file
   */
  async deleteEmployeeFile(employeeId: string, filePath: string): Promise<boolean> {
    try {
      return await deleteFile(filePath);
    } catch (error) {
      console.error('Error deleting employee file:', error);
      return false;
    }
  }
  
  /**
   * Delete a folder and all its contents
   */
  async deleteEmployeeFolder(employeeId: string, folderPath: string): Promise<boolean> {
    try {
      const result = await listFiles(folderPath);
      if (!result || result.files.length === 0) {
        return true;
      }
      
      const fileNames = result.files.map(file => file.name);
      const deleteResult = await bulkDeleteFiles(fileNames);
      
      return deleteResult ? deleteResult.deleted === deleteResult.total : false;
    } catch (error) {
      console.error('Error deleting employee folder:', error);
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

export const employeeDocumentsService = new EmployeeDocumentsService();

export default {
  getEmployeeDocuments: employeeDocumentsService.getEmployeeDocuments.bind(employeeDocumentsService),
  uploadEmployeeFile: employeeDocumentsService.uploadEmployeeFile.bind(employeeDocumentsService),
  createEmployeeFolder: employeeDocumentsService.createEmployeeFolder.bind(employeeDocumentsService),
  deleteEmployeeFile: employeeDocumentsService.deleteEmployeeFile.bind(employeeDocumentsService),
  deleteEmployeeFolder: employeeDocumentsService.deleteEmployeeFolder.bind(employeeDocumentsService),
  getFileDownloadUrl: employeeDocumentsService.getFileDownloadUrl.bind(employeeDocumentsService),
  fileExists: employeeDocumentsService.fileExists.bind(employeeDocumentsService),
  getFileTypeIcon: employeeDocumentsService.getFileTypeIcon.bind(employeeDocumentsService),
  formatFileSize: employeeDocumentsService.formatFileSize.bind(employeeDocumentsService),
  getBreadcrumb: employeeDocumentsService.getBreadcrumb.bind(employeeDocumentsService)
}; 