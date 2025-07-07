import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const skillController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const skills = await skillService.getAll();
    res.json(skills);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillService.getById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillService.create(req.body);
    res.status(201).json(skill);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillService.update(req.params.id, req.body);
    res.json(skill);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await skillService.remove(req.params.id);
    res.status(204).send();
  }),
}; 