import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const userController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAll();
    res.json(users);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await userService.remove(req.params.id);
    res.status(204).send();
  }),
}; 