import { Router } from 'express';
import { skillTrainingController } from '../controllers/skill-training.controller';

const router = Router();

router.get('/', skillTrainingController.getAll);
router.get('/:id', skillTrainingController.getById);
router.post('/', skillTrainingController.create);
router.put('/:id', skillTrainingController.update);
router.delete('/:id', skillTrainingController.remove);

export default router; 