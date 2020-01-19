import { Router } from 'express';

import StudentsController from '../app/controllers/StudentsController';
import CheckinController from '../app/controllers/CheckinController';

const router = new Router();

router.post('', StudentsController.store);
router.put('', StudentsController.update);
router.post('/:id/checkins', CheckinController.store);
router.get('/:id/checkins', CheckinController.index);

export default router;
