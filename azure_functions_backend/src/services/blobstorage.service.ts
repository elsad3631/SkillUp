import { BlobServiceClient, ContainerClient, BlockBlobClient, BlobDownloadResponseParsed, BlobItem } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = "DefaultEndpointsProtocol=https;AccountName=intentaistorage;AccountKey=OcyVws7RI7V1fKFgpLxfBYjUF/y/Lf9FAZRmIyx2ZiXMZ1vsylYFsMgJBVPpFVsLawxzdXtV41FS+ASt1KdB1g==;EndpointSuffix=core.windows.net"//process.env.AzureBlobStorageConnectionString;
const containerName = process.env.AzureBlobStorageContainer;

if (!connectionString) {
  throw new Error('Azure Storage Connection string not found in environment variables');
}

if (!containerName) {
  throw new Error('Azure Storage Container name not found in environment variables');
}

class BlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString!);
    this.containerClient = this.blobServiceClient.getContainerClient(containerName!);
  }

  async initializeContainer(): Promise<void> {
    try {
      // Check if container already exists
      const exists = await this.containerClient.exists();
      console.log("connectionString", connectionString);
      if (exists) {
        console.log(`✅ Container "${containerName}" already exists with proper access.`);
        return;
      }

      // Create container with public blob access
      const createContainerResponse = await this.containerClient.createIfNotExists({
        access: 'blob' // This allows public read access to blobs but not container listing
      });
      
      if (createContainerResponse.succeeded) {
        console.log(`✅ Container "${containerName}" created successfully with public blob access.`);
      } else {
        console.log(`ℹ️  Container "${containerName}" already existed.`);
      }
    } catch (error) {
      console.error(`❌ Error initializing container "${containerName}":`, error);
      throw error;
    }
  }

  async uploadFile(blobName: string, data: Buffer, contentType?: string, metadata?: Record<string, string>): Promise<string> {
    try {
      // Ensure container exists with public blob access before uploading
      await this.initializeContainer();
      
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      
      const uploadOptions: any = {
        blobHTTPHeaders: {
          blobContentType: contentType || 'application/octet-stream'
        }
      };

      // Add metadata if provided
      if (metadata) {
        uploadOptions.metadata = metadata;
      }

      const uploadBlobResponse = await blockBlobClient.upload(data, data.length, uploadOptions);
      
      if (uploadBlobResponse.errorCode) {
        throw new Error(`Upload failed: ${uploadBlobResponse.errorCode}`);
      }

      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadStream(blobName: string, stream: any, contentType?: string, metadata?: Record<string, string>): Promise<string> {
    try {
      // Ensure container exists with public blob access before uploading
      await this.initializeContainer();
      
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      
      const uploadOptions: any = {
        blobHTTPHeaders: {
          blobContentType: contentType || 'application/octet-stream'
        }
      };

      // Add metadata if provided
      if (metadata) {
        uploadOptions.metadata = metadata;
      }

      const uploadBlobResponse = await blockBlobClient.uploadStream(stream, undefined, undefined, uploadOptions);
      
      if (uploadBlobResponse.errorCode) {
        throw new Error(`Upload failed: ${uploadBlobResponse.errorCode}`);
      }

      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading stream:', error);
      throw error;
    }
  }

  async downloadFile(blobName: string): Promise<BlobDownloadResponseParsed> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const downloadBlockBlobResponse = await blockBlobClient.download();
      return downloadBlockBlobResponse;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getFileBuffer(blobName: string): Promise<Buffer> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      // Use downloadToBuffer which handles the stream conversion internally
      const buffer = await blockBlobClient.downloadToBuffer();
      return buffer;
    } catch (error) {
      console.error('Error getting file buffer:', error);
      throw error;
    }
  }

  async deleteFile(blobName: string): Promise<void> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const deleteResponse = await blockBlobClient.deleteIfExists();
      
      if (!deleteResponse.succeeded) {
        throw new Error(`Failed to delete blob: ${blobName}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async fileExists(blobName: string): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const response = await blockBlobClient.exists();
      return response;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  async listFiles(prefix?: string): Promise<BlobItem[]> {
    try {
      const blobs: BlobItem[] = [];
      const options = prefix ? { prefix } : undefined;
      
      for await (const blob of this.containerClient.listBlobsFlat(options)) {
        blobs.push(blob);
      }
      
      return blobs;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async getFileProperties(blobName: string) {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const properties = await blockBlobClient.getProperties();
      return {
        contentLength: properties.contentLength,
        contentType: properties.contentType,
        lastModified: properties.lastModified,
        etag: properties.etag,
        metadata: properties.metadata
      };
    } catch (error) {
      console.error('Error getting file properties:', error);
      throw error;
    }
  }

  async copyFile(sourceBlobName: string, destinationBlobName: string): Promise<string> {
    try {
      const sourceBlobClient = this.containerClient.getBlockBlobClient(sourceBlobName);
      const destinationBlobClient = this.containerClient.getBlockBlobClient(destinationBlobName);
      
      // Use the public syncCopyFromURL method instead of the private startCopyFromURL
      const copyResponse = await destinationBlobClient.syncCopyFromURL(sourceBlobClient.url);
      
      if (copyResponse.errorCode) {
        throw new Error(`Copy failed: ${copyResponse.errorCode}`);
      }

      return destinationBlobClient.url;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  async generateSasUrl(blobName: string, expiresInHours: number = 1): Promise<string> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      
      // Note: For SAS URL generation, you might need to use account key or managed identity
      // This is a simplified version - in production, consider using SAS tokens properly
      const expiresOn = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
      
      // For now, return the direct URL. In production, you should implement proper SAS token generation
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw error;
    }
  }



  generateUniqueFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    
    return prefix 
      ? `${prefix}/${timestamp}_${randomSuffix}_${baseName}.${extension}`
      : `${timestamp}_${randomSuffix}_${baseName}.${extension}`;
  }

  extractFileNameFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  async bulkDeleteFiles(fileNames: string[]): Promise<{
    total: number;
    deleted: number;
    failed: number;
    results: Array<{
      fileName: string;
      deleted: boolean;
      error: string | null;
    }>;
  }> {
    try {
      const results = await Promise.allSettled(
        fileNames.map(async (fileName) => {
          try {
            await this.deleteFile(fileName);
            return {
              fileName,
              deleted: true,
              error: null
            };
          } catch (error) {
            return {
              fileName,
              deleted: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      const processedResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            fileName: fileNames[index],
            deleted: false,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          };
        }
      });

      const deleted = processedResults.filter(r => r.deleted).length;
      const failed = processedResults.filter(r => !r.deleted).length;

      return {
        total: fileNames.length,
        deleted,
        failed,
        results: processedResults
      };
    } catch (error) {
      console.error('Error in bulk delete operation:', error);
      throw error;
    }
  }
}

export const blobStorageService = new BlobStorageService(); 