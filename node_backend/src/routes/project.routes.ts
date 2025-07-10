import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', projectController.getAll);
router.get('/my-projects', authenticateJWT, projectController.getUserProjects);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);


export default router; 