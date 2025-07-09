import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { blobStorageService } from '../services/blobstorage.service';

// Extend Express Request type to include file and files properties
interface MulterRequest extends Request {
  file?: any;
  files?: any[];
}

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Add any file type restrictions here if needed
    cb(null, true);
  },
});

export const blobStorageController = {
  // Middleware for single file upload
  uploadMiddleware: upload.single('file'),

  // Middleware for multiple files upload
  uploadMultipleMiddleware: upload.array('files', 10),

  // Initialize container
  initializeContainer: asyncHandler(async (req: Request, res: Response) => {
    await blobStorageService.initializeContainer();
    res.json({ message: 'Container initialized successfully' });
  }),

  // Upload single file
  uploadFile: asyncHandler(async (req: MulterRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const { prefix, customName } = req.body;

    const fileName = customName || blobStorageService.generateUniqueFileName(originalname, prefix);
    const fileUrl = await blobStorageService.uploadFile(fileName, buffer, mimetype);

    res.status(201).json({
      message: 'File uploaded successfully',
      fileName,
      fileUrl,
      size: buffer.length,
      contentType: mimetype,
    });
  }),

  // Upload multiple files
  uploadMultipleFiles: asyncHandler(async (req: MulterRequest, res: Response) => {
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const { prefix } = req.body;
    const uploadPromises = files.map(async (file) => {
      const fileName = blobStorageService.generateUniqueFileName(file.originalname, prefix);
      const fileUrl = await blobStorageService.uploadFile(fileName, file.buffer, file.mimetype);
      
      return {
        originalName: file.originalname,
        fileName,
        fileUrl,
        size: file.size,
        contentType: file.mimetype,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
      count: uploadedFiles.length,
    });
  }),

  // Download file
  downloadFile: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const exists = await blobStorageService.fileExists(fileName);
    if (!exists) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileBuffer = await blobStorageService.getFileBuffer(fileName);
    const properties = await blobStorageService.getFileProperties(fileName);

    res.set({
      'Content-Type': properties.contentType || 'application/octet-stream',
      'Content-Length': properties.contentLength?.toString(),
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    res.send(fileBuffer);
  }),

  // Serve avatar images (proxy endpoint for public access)
  serveAvatar: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    // Extract just the filename if a full path is provided
    const actualFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;
    
    if (!actualFileName) {
      return res.status(400).json({ message: 'Invalid file name' });
    }

    // Check if file exists in avatars directory
    const avatarPath = `avatars/${actualFileName}`;
    const exists = await blobStorageService.fileExists(avatarPath);
    if (!exists) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    try {
      const fileBuffer = await blobStorageService.getFileBuffer(avatarPath);
      const properties = await blobStorageService.getFileProperties(avatarPath);

      // Set appropriate headers for image serving
      res.set({
        'Content-Type': properties.contentType || 'image/jpeg',
        'Content-Length': properties.contentLength?.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'ETag': properties.etag,
      });

      res.send(fileBuffer);
    } catch (error) {
      console.error('Error serving avatar:', error);
      res.status(500).json({ message: 'Error serving avatar image' });
    }
  }),

  // Get file info/properties
  getFileInfo: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const exists = await blobStorageService.fileExists(fileName);
    if (!exists) {
      return res.status(404).json({ message: 'File not found' });
    }

    const properties = await blobStorageService.getFileProperties(fileName);

    res.json({
      fileName,
      exists: true,
      properties,
    });
  }),

  // Delete file
  deleteFile: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const exists = await blobStorageService.fileExists(fileName);
    if (!exists) {
      return res.status(404).json({ message: 'File not found' });
    }

    await blobStorageService.deleteFile(fileName);

    res.json({ message: 'File deleted successfully', fileName });
  }),

  // List files
  listFiles: asyncHandler(async (req: Request, res: Response) => {
    const { prefix, limit = '100', offset = '0' } = req.query;

    const files = await blobStorageService.listFiles(prefix as string);
    
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    
    const paginatedFiles = files.slice(offsetNum, offsetNum + limitNum);

    res.json({
      files: paginatedFiles.map(blob => ({
        name: blob.name,
        size: blob.properties.contentLength,
        contentType: blob.properties.contentType,
        lastModified: blob.properties.lastModified,
        etag: blob.properties.etag,
      })),
      total: files.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < files.length,
    });
  }),

  // Check if file exists
  fileExists: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const exists = await blobStorageService.fileExists(fileName);

    res.json({
      fileName,
      exists,
    });
  }),

  // Copy file
  copyFile: asyncHandler(async (req: Request, res: Response) => {
    const { sourceFileName, destinationFileName } = req.body;

    if (!sourceFileName || !destinationFileName) {
      return res.status(400).json({ 
        message: 'Source file name and destination file name are required' 
      });
    }

    const sourceExists = await blobStorageService.fileExists(sourceFileName);
    if (!sourceExists) {
      return res.status(404).json({ message: 'Source file not found' });
    }

    const destinationUrl = await blobStorageService.copyFile(sourceFileName, destinationFileName);

    res.json({
      message: 'File copied successfully',
      sourceFileName,
      destinationFileName,
      destinationUrl,
    });
  }),

  // Generate SAS URL (shared access signature)
  generateSasUrl: asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const { expiresInHours = '1' } = req.query;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const exists = await blobStorageService.fileExists(fileName);
    if (!exists) {
      return res.status(404).json({ message: 'File not found' });
    }

    const sasUrl = await blobStorageService.generateSasUrl(fileName, parseInt(expiresInHours as string));

    res.json({
      fileName,
      sasUrl,
      expiresInHours: parseInt(expiresInHours as string),
    });
  }),

  // Bulk delete files
  bulkDeleteFiles: asyncHandler(async (req: Request, res: Response) => {
    const { fileNames } = req.body;

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return res.status(400).json({ message: 'File names array is required' });
    }

    const deletePromises = fileNames.map(async (fileName: string) => {
      try {
        const exists = await blobStorageService.fileExists(fileName);
        if (exists) {
          await blobStorageService.deleteFile(fileName);
          return { fileName, deleted: true, error: null };
        } else {
          return { fileName, deleted: false, error: 'File not found' };
        }
      } catch (error) {
        return { fileName, deleted: false, error: (error as Error).message };
      }
    });

    const results = await Promise.all(deletePromises);

    const deleted = results.filter(r => r.deleted).length;
    const failed = results.filter(r => !r.deleted).length;

    res.json({
      message: 'Bulk delete completed',
      total: fileNames.length,
      deleted,
      failed,
      results,
    });
  }),

  // Get storage stats
  getStorageStats: asyncHandler(async (req: Request, res: Response) => {
    const { prefix } = req.query;
    
    const files = await blobStorageService.listFiles(prefix as string);
    
    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + (file.properties.contentLength || 0), 0),
      averageSize: 0,
      fileTypes: {} as Record<string, number>,
      oldestFile: null as any,
      newestFile: null as any,
    };

    if (stats.totalFiles > 0) {
      stats.averageSize = Math.round(stats.totalSize / stats.totalFiles);
      
      // Count file types
      files.forEach(file => {
        const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1;
      });

      // Find oldest and newest files
      const sortedByDate = files
        .filter(f => f.properties.lastModified)
        .sort((a, b) => new Date(a.properties.lastModified!).getTime() - new Date(b.properties.lastModified!).getTime());

      if (sortedByDate.length > 0) {
        stats.oldestFile = {
          name: sortedByDate[0].name,
          lastModified: sortedByDate[0].properties.lastModified,
        };
        stats.newestFile = {
          name: sortedByDate[sortedByDate.length - 1].name,
          lastModified: sortedByDate[sortedByDate.length - 1].properties.lastModified,
        };
      }
    }

    res.json(stats);
  }),
}; 