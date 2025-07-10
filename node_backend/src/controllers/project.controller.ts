import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const projectController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const projects = await projectService.getAll();
    res.json(projects);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.body);
    res.status(201).json(project);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.update(req.params.id, req.body);
    res.json(project);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove(req.params.id);
    res.status(204).send();
  }),
  createSkillRequirement: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectService.createSkillRequirement(req.body);
    res.status(201).json(skill);
  }),
  updateSkillRequirement: asyncHandler(async (req: Request, res: Response) => {
    const skill = await projectService.updateSkillRequirement(req.params.id, req.body);
    res.json(skill);
  }),
  deleteSkillRequirement: asyncHandler(async (req: Request, res: Response) => {
    await projectService.deleteSkillRequirement(req.params.id);
    res.status(204).send();
  }),
  getUserProjects: asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const projects = await projectService.getUserProjects(user.userId);
    res.json(projects);
  }),
}; 