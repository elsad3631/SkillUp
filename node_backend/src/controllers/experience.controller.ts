import { Request, Response, NextFunction } from 'express';
import { experienceService } from '../services/experience.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const experienceController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const experiences = await experienceService.getAll();
    res.json(experiences);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const experience = await experienceService.getById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Not found' });
    res.json(experience);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const experience = await experienceService.create(req.body);
    res.status(201).json(experience);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const experience = await experienceService.update(req.params.id, req.body);
    res.json(experience);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await experienceService.remove(req.params.id);
    res.status(204).send();
  }),
}; 