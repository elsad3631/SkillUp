import { Router } from 'express';
import { blobStorageController } from '../controllers/blobstorage.controller';

const router = Router();

// Container management
router.post('/container/init', blobStorageController.initializeContainer);

// File upload routes
router.post('/upload', 
  blobStorageController.uploadMiddleware, 
  blobStorageController.uploadFile
);

router.post('/upload/multiple', 
  blobStorageController.uploadMultipleMiddleware, 
  blobStorageController.uploadMultipleFiles
);

// Avatar serving route (public access proxy)
router.get('/avatar/:fileName', blobStorageController.serveAvatar);

// File download and info routes
router.get('/download/:fileName', blobStorageController.downloadFile);
router.get('/info/:fileName', blobStorageController.getFileInfo);
router.get('/exists/:fileName', blobStorageController.fileExists);

// File management routes
router.delete('/:fileName', blobStorageController.deleteFile);
router.post('/copy', blobStorageController.copyFile);

// File listing and search routes
router.get('/list', blobStorageController.listFiles);
router.get('/stats', blobStorageController.getStorageStats);

// SAS URL generation
router.get('/sas/:fileName', blobStorageController.generateSasUrl);

// Bulk operations
router.post('/bulk/delete', blobStorageController.bulkDeleteFiles);

export default router; 