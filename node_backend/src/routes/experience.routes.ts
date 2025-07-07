import { Router } from 'express';
import { experienceController } from '../controllers/experience.controller';

const router = Router();

router.get('/', experienceController.getAll);
router.get('/:id', experienceController.getById);
router.post('/', experienceController.create);
router.put('/:id', experienceController.update);
router.delete('/:id', experienceController.remove);

export default router; 