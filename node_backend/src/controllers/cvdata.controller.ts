import { Request, Response, NextFunction } from 'express';
import { cvDataService } from '../services/cvdata.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

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
}; 