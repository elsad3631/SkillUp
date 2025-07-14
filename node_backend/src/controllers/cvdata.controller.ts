import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { cvDataService } from '../services/cvdata.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') cb(null, true);
    else cb(new Error('Only .pdf and .docx files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const cvDataController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const cvData = await cvDataService.getAll();
    res.json(cvData);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const cv = await cvDataService.getById(req.params.id);
    if (!cv) return res.status(404).json({ message: 'Not found' });
    res.json(cv);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const cv = await cvDataService.create(req.body);
    res.status(201).json(cv);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const cv = await cvDataService.update(req.params.id, req.body);
    res.json(cv);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await cvDataService.remove(req.params.id);
    res.status(204).send();
  }),
  extractFromCV: [
    upload.single('cv'),
    asyncHandler(async (req: Request, res: Response) => {
      console.log('=== DEBUG extractFromCV ===');
      console.log('File uploaded:', !!req.file);
      if (req.file) {
        console.log('File details:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        });
      }
      
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      
      try {
        const result = await cvDataService.extractFromCV(req.file);
        console.log('Service result:', result);
        res.json(result);
      } catch (error) {
        console.error('Service error:', error);
        res.status(500).json({ message: 'Error processing CV', error: (error as Error).message });
      }
    })
  ],
}; 