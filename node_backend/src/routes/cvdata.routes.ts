import { Router } from 'express';
import { cvDataController } from '../controllers/cvdata.controller';

const router = Router();

router.get('/', cvDataController.getAll);
router.get('/:id', cvDataController.getById);
router.post('/', cvDataController.create);
router.put('/:id', cvDataController.update);
router.delete('/:id', cvDataController.remove);
router.post('/from-cv', cvDataController.extractFromCV);

export default router; 