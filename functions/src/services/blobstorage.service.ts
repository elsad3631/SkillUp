import { BlobServiceClient, ContainerClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';

interface BlobUploadResult {
  url: string;
  fileName: string;
}

interface BlobDownloadResult {
  content: Buffer;
  contentType: string;
}

class BlobStorageService {
  private containerClient: ContainerClient;
  private blobServiceClient: BlobServiceClient;
  private accountName: string;
  private accountKey: string;
  private containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
    this.accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'skillup-files';

    if (!connectionString && (!this.accountName || !this.accountKey)) {
      throw new Error('Azure Storage connection string or account credentials are required');
    }

    if (connectionString) {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    } else {
      const credential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
      this.blobServiceClient = new BlobServiceClient(
        `https://${this.accountName}.blob.core.windows.net`,
        credential
      );
    }

    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  }

  async initializeContainer(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists({
        access: 'blob'
      });
      console.log(`Container "${this.containerName}" is ready`);
    } catch (error) {
      console.error('Error initializing container:', error);
      throw error;
    }
  }

  async uploadFile(file: Buffer, fileName: string, contentType?: string): Promise<BlobUploadResult> {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      
      const uploadResponse = await blobClient.upload(file, file.length, {
        blobHTTPHeaders: {
          blobContentType: contentType || 'application/octet-stream'
        }
      });

      if (uploadResponse.errorCode) {
        throw new Error(`Upload failed: ${uploadResponse.errorCode}`);
      }

      return {
        url: blobClient.url,
        fileName: fileName
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async downloadFile(fileName: string): Promise<BlobDownloadResult> {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      const downloadResponse = await blobClient.download();
      
      if (!downloadResponse.readableStreamBody) {
        throw new Error('No content found');
      }

      const chunks: Buffer[] = [];
      const readable = downloadResponse.readableStreamBody;
      
      for await (const chunk of readable) {
        chunks.push(chunk);
      }

      const content = Buffer.concat(chunks);
      const contentType = downloadResponse.contentType || 'application/octet-stream';

      return {
        content,
        contentType
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      const deleteResponse = await blobClient.delete();
      
      return deleteResponse.errorCode === undefined;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const fileNames: string[] = [];
      
      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        fileNames.push(blob.name);
      }

      return fileNames;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      const exists = await blobClient.exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  async getFileProperties(fileName: string) {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      const properties = await blobClient.getProperties();
      
      return {
        lastModified: properties.lastModified,
        contentLength: properties.contentLength,
        contentType: properties.contentType,
        etag: properties.etag
      };
    } catch (error) {
      console.error('Error getting file properties:', error);
      throw error;
    }
  }

  generateSASUrl(fileName: string, expiresInMinutes: number = 60): string {
    try {
      if (!this.accountName || !this.accountKey) {
        throw new Error('Account name and key are required for SAS URL generation');
      }

      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      const credential = new StorageSharedKeyCredential(this.accountName, this.accountKey);

      const sasOptions = {
        containerName: this.containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + expiresInMinutes * 60 * 1000)
      };

      const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
      return `${blobClient.url}?${sasToken}`;
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw error;
    }
  }

  async uploadMultipleFiles(files: Array<{ buffer: Buffer; fileName: string; contentType?: string }>): Promise<BlobUploadResult[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.buffer, file.fileName, file.contentType)
      );
      
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  async copyFile(sourceFileName: string, destinationFileName: string): Promise<boolean> {
    try {
      const sourceBlobClient = this.containerClient.getBlockBlobClient(sourceFileName);
      const destinationBlobClient = this.containerClient.getBlockBlobClient(destinationFileName);
      
      const copyResponse = await destinationBlobClient.startCopyFromURL(sourceBlobClient.url);
      
      // Wait for copy to complete
      let copyStatus = copyResponse.copyStatus;
      while (copyStatus === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const properties = await destinationBlobClient.getProperties();
        copyStatus = properties.copyStatus;
      }
      
      return copyStatus === 'success';
    } catch (error) {
      console.error('Error copying file:', error);
      return false;
    }
  }

  async moveFile(sourceFileName: string, destinationFileName: string): Promise<boolean> {
    try {
      const copySuccess = await this.copyFile(sourceFileName, destinationFileName);
      
      if (copySuccess) {
        const deleteSuccess = await this.deleteFile(sourceFileName);
        return deleteSuccess;
      }
      
      return false;
    } catch (error) {
      console.error('Error moving file:', error);
      return false;
    }
  }

  async getFileUrl(fileName: string): string {
    const blobClient = this.containerClient.getBlockBlobClient(fileName);
    return blobClient.url;
  }

  async searchFiles(searchTerm: string): Promise<string[]> {
    try {
      const allFiles = await this.listFiles();
      return allFiles.filter(fileName => 
        fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  }

  async getContainerInfo() {
    try {
      const properties = await this.containerClient.getProperties();
      const blobs = await this.listFiles();
      
      return {
        containerName: this.containerName,
        lastModified: properties.lastModified,
        publicAccess: properties.blobPublicAccess,
        fileCount: blobs.length
      };
    } catch (error) {
      console.error('Error getting container info:', error);
      throw error;
    }
  }
}

export const blobStorageService = new BlobStorageService(); 