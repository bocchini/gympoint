import { Router } from 'express';

import PlanController from '../app/controllers/PlanController';

const router = new Router();

router.get('', PlanController.index);
router.post('', PlanController.store);
router.put('', PlanController.update);
router.delete('/:id', PlanController.delete);

export default router;
