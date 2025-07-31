import { ref, computed, readonly } from 'vue';
import { uploadFile, deleteFile, fileExists, type FileUploadResponse } from '@/core/services/businessServices/BlobStorage';
import { Employee } from '@/core/models/Employee';

// Avatar management composable
export function useAvatar() {
  // Reactive state
  const isUploading = ref(false);
  const isDeleting = ref(false);
  const uploadProgress = ref(0);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Cache for avatar URLs to avoid duplicate calls
  const avatarUrlCache = new Map<string, string>();

  // Supported file types for avatars
  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Validate avatar file
   */
  const validateAvatarFile = (file: File): { isValid: boolean; error?: string } => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please use JPG, PNG, or WebP format.',
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size too large. Maximum allowed size is 5MB.',
      };
    }

    return { isValid: true };
  };

  /**
   * Generate avatar filename for an employee
   */
  const generateAvatarFileName = (employeeId: string, file: File): string => {
    const extension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return `avatars/employees/${employeeId}/${timestamp}_${randomSuffix}_${baseName}.${extension}`;
  };

  /**
   * Extract filename from blob storage URL
   */
  const extractFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // For Azure Storage URLs like: https://intentaistorage.blob.core.windows.net/skillup/avatars/employees/id/filename.jpg
      // pathname will be: /skillup/avatars/employees/id/filename.jpg
      // For local development URLs like: http://127.0.0.1:10000/devstoreaccount1/skillup/avatars/employees/id/filename.jpg
      // pathname will be: /devstoreaccount1/skillup/avatars/employees/id/filename.jpg
      const parts = pathname.split('/').filter(part => part.length > 0);
      
      if (parts.length >= 3) {
        // For Azure Storage: skip container name (skillup) and take everything after
        // For local development: skip account name (devstoreaccount1) and container name (skillup)
        let fileName: string;
        if (url.includes('blob.core.windows.net')) {
          // Azure Storage: /skillup/avatars/employees/id/filename.jpg
          fileName = parts.slice(1).join('/'); // Skip 'skillup', keep 'avatars/employees/id/filename.jpg'
        } else {
          // Local development: /devstoreaccount1/skillup/avatars/employees/id/filename.jpg
          fileName = parts.slice(2).join('/'); // Skip 'devstoreaccount1' and 'skillup', keep 'avatars/employees/id/filename.jpg'
        }
        // Decode URL-encoded characters
        return decodeURIComponent(fileName);
      }
      
      // Fallback: just the last part
      const fileName = parts[parts.length - 1] || '';
      return decodeURIComponent(fileName);
    } catch (error) {
      console.error('Error extracting filename from URL:', url, error);
      // Fallback: assume the filename is the last part of the URL
      const fileName = url.split('/').pop() || '';
      return decodeURIComponent(fileName);
    }
  };

  /**
   * Convert blob storage URL to proxy URL for displaying avatars
   */
  const convertToProxyUrl = (blobStorageUrl: string): string => {
    try {
      // Extract just the filename from the blob storage URL
      const fileName = extractFileNameFromUrl(blobStorageUrl);
      
      // If it's already a proxy URL or relative URL, return as is
      if (blobStorageUrl.includes('/api/blobstorage/avatar/') || !blobStorageUrl.includes('http')) {
        return blobStorageUrl;
      }
      
      // Handle new path structure: avatars/employees/id/filename
      // Keep the full path for the proxy endpoint
      const proxyUrl = `/api/blobstorage/avatar/${fileName}`;
      return proxyUrl;
    } catch (error) {
      console.error('Error converting to proxy URL:', error);
      return blobStorageUrl; // Return original URL as fallback
    }
  };

  /**
   * Get display URL for avatar (converts blob storage URLs to proxy URLs)
   */
  const getAvatarDisplayUrl = async (avatarUrl: string | null | undefined): Promise<string | null> => {
    if (!avatarUrl) return null;
    
    // Check cache first
    if (avatarUrlCache.has(avatarUrl)) {
      return avatarUrlCache.get(avatarUrl)!;
    }
    
    let result: string | null = null;
    
    // If it's a blob storage URL, convert it to proxy URL
    if (avatarUrl.includes('127.0.0.1:10000') || avatarUrl.includes('blob.core.windows.net')) {
      const proxyUrl = convertToProxyUrl(avatarUrl);
      
      // Don't check file existence here to avoid duplicate calls
      // The browser will handle 404 errors gracefully
      result = proxyUrl;
    } else {
      // If it's already a proxy URL or relative URL, return as is
      result = avatarUrl;
    }
    
    // Cache the result
    if (result) {
      avatarUrlCache.set(avatarUrl, result);
    }
    
    return result;
  };

  /**
   * Upload avatar file to storage only (no database update)
   */
  const uploadAvatarFile = async (employeeId: string, file: File): Promise<FileUploadResponse | null> => {
    try {
      // Reset states
      error.value = null;
      success.value = null;
      isUploading.value = true;
      uploadProgress.value = 0;

      // Validate file
      const validation = validateAvatarFile(file);
      if (!validation.isValid) {
        error.value = validation.error!;
        return null;
      }

      // Generate unique filename
      const fileName = generateAvatarFileName(employeeId, file);

      // Upload file to blob storage only
      uploadProgress.value = 50;
      const uploadResult = await uploadFile(file, undefined, fileName);
      
      if (!uploadResult) {
        error.value = 'Failed to upload avatar to storage';
        return null;
      }

      uploadProgress.value = 100;
      success.value = 'Avatar uploaded (not saved yet)';
      
      return uploadResult;

    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred';
      return null;
    } finally {
      isUploading.value = false;
      setTimeout(() => {
        uploadProgress.value = 0;
        success.value = null;
      }, 3000);
    }
  };

  /**
   * Save avatar URL to database
   */
  const saveAvatarToDatabase = async (employeeId: string, avatarUrl: string): Promise<boolean> => {
    try {
      // Get current employee data
      const response = await fetch(`/api/applicationuser/${employeeId}`);
      if (!response.ok) {
        error.value = 'Employee not found';
        return false;
      }
      const employee = await response.json();

      // Delete existing avatar file if present
      if (employee.avatar && employee.avatar !== avatarUrl) {
        const oldFileName = extractFileNameFromUrl(employee.avatar);
        
        if (oldFileName) {
          try {
            // List files in the employee's avatar directory to see what's actually there
            const prefix = `avatars/employees/${employeeId}/`;
            
            const listResponse = await fetch(`/api/blobstorage/list?prefix=${encodeURIComponent(prefix)}`);
            let listData: any = null;
            if (listResponse.ok) {
              listData = await listResponse.json();
            }
            
            // Verifica se il file esiste prima di tentare di eliminarlo
            const existsResult = await fileExists(oldFileName);
            
            if (existsResult && existsResult.exists) {
              const deleteResult = await deleteFile(oldFileName);
            } else {
              
              // Try to find the file by listing all files and matching by pattern
              if (listData && listData.files && listData.files.length > 0) {
                const matchingFiles = listData.files.filter((file: any) => 
                  file.name.includes(employeeId) && file.name.includes('.jpg')
                );
                
                if (matchingFiles.length > 0) {
                  const actualFileName = matchingFiles[0].name;
                  const deleteResult = await deleteFile(actualFileName);
                }
              }
            }
          } catch (err) {
            // Ignora gli errori di eliminazione del vecchio file
            console.log('⚠️ Error checking/deleting previous avatar file:', err);
          }
        } else {
          console.log('⚠️ Could not extract filename from old avatar URL');
        }
      }

      // Update employee record with new avatar URL
      const updateData = { 
        ...employee,
        avatar: avatarUrl 
      };
      
      const updateResponse = await fetch(`/api/applicationuser/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Failed to update avatar:', errorText);
        error.value = `Failed to update employee record: ${errorText}`;
        return false;
      }
      
      const updatedEmployee = await updateResponse.json();
      
      success.value = 'Avatar saved successfully';
      
      // Emit custom event for avatar update
      window.dispatchEvent(new CustomEvent('avatarUpdated', {
        detail: { employeeId, avatarUrl }
      }));
      
      return true;

    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred';
      return false;
    }
  };

  /**
   * Legacy method for backward compatibility - uploads and saves immediately
   */
  const uploadAvatar = async (employeeId: string, file: File): Promise<FileUploadResponse | null> => {
    const uploadResult = await uploadAvatarFile(employeeId, file);
    if (uploadResult) {
      const saved = await saveAvatarToDatabase(employeeId, uploadResult.fileUrl);
      if (!saved) {
        // If save fails, clean up uploaded file
        await deleteFile(uploadResult.fileName);
        return null;
      }
    }
    return uploadResult;
  };

  /**
   * Delete current avatar
   */
  const deleteCurrentAvatar = async (employeeId: string, avatarUrl?: string): Promise<boolean> => {
    try {
      isDeleting.value = true;
      error.value = null;

      // Get current employee data
      const response = await fetch(`/api/applicationuser/${employeeId}`);
      if (!response.ok) {
        error.value = 'Employee not found';
        console.log('❌ Employee not found');
        return false;
      }
      const employee = await response.json();

      // Update employee record to remove avatar URL first
      const updateData = { 
        ...employee,
        avatar: null 
      };
      const updateResponse = await fetch(`/api/applicationuser/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!updateResponse.ok) {
        error.value = 'Failed to update employee record';
        console.log('❌ Failed to update employee record:', updateResponse.status);
        return false;
      }

      // Try to delete the file if it exists, but don't fail if it doesn't
      let fileName: string | null = null;
      if (avatarUrl) {
        fileName = extractFileNameFromUrl(avatarUrl);
      } else if (employee.avatar) {
        fileName = extractFileNameFromUrl(employee.avatar);
      }

      if (fileName) {
        try {
          await deleteFile(fileName);
        } catch (err) {
          // Ignore file deletion errors - the file might not exist
          console.log('⚠️ Avatar file not found or already deleted');
        }
      }

      success.value = 'Avatar deleted successfully';
      
      // Emit custom event for avatar update
      window.dispatchEvent(new CustomEvent('avatarUpdated', {
        detail: { employeeId }
      }));
      
      return true;

    } catch (err: any) {
      error.value = err.message || 'Failed to delete avatar';
      console.log('❌ Error during avatar deletion:', err);
      return false;
    } finally {
      isDeleting.value = false;
      setTimeout(() => {
        success.value = null;
      }, 3000);
    }
  };

  /**
   * Replace current avatar with a new one
   */
  const replaceAvatar = async (employeeId: string, newFile: File): Promise<FileUploadResponse | null> => {
    // Simply upload new avatar (uploadAvatar handles deletion of old one)
    return await uploadAvatar(employeeId, newFile);
  };

  /**
   * Get avatar preview URL
   */
  const getAvatarPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  /**
   * Clean up object URL
   */
  const cleanupPreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
  };

  /**
   * Handle file input change
   */
  const handleFileChange = async (event: Event, employeeId: string, onSuccess?: (result: FileUploadResponse) => void): Promise<void> => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    const result = await uploadAvatar(employeeId, file);
    if (result && onSuccess) {
      onSuccess(result);
    }

    // Reset input
    input.value = '';
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Clear error and success messages
   */
  const clearMessages = (): void => {
    error.value = null;
    success.value = null;
  };

  /**
   * Clear avatar URL cache
   */
  const clearAvatarCache = (): void => {
    avatarUrlCache.clear();
  };

  /**
   * Clear avatar URL cache for specific URL
   */
  const clearAvatarCacheForUrl = (avatarUrl: string): void => {
    avatarUrlCache.delete(avatarUrl);
  };

  // Computed properties
  const isProcessing = computed(() => isUploading.value || isDeleting.value);
  const hasError = computed(() => !!error.value);
  const hasSuccess = computed(() => !!success.value);

  return {
    // State
    isUploading: readonly(isUploading),
    isDeleting: readonly(isDeleting),
    isProcessing,
    uploadProgress: readonly(uploadProgress),
    error: readonly(error),
    success: readonly(success),
    hasError,
    hasSuccess,

    // Methods
    uploadAvatar,
    uploadAvatarFile,
    saveAvatarToDatabase,
    deleteCurrentAvatar,
    replaceAvatar,
    validateAvatarFile,
    getAvatarPreviewUrl,
    getAvatarDisplayUrl,
    cleanupPreviewUrl,
    handleFileChange,
    formatFileSize,
    clearMessages,
    clearAvatarCache,
    clearAvatarCacheForUrl,

    // Constants
    SUPPORTED_TYPES,
    MAX_FILE_SIZE,
  };
} 