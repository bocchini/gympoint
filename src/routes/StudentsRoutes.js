import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';

import StudentsController from '../app/controllers/StudentsController';
import CheckinController from '../app/controllers/CheckinController';
import HelpOrdersController from '../app/controllers/HelpOrdersController';
import AnswerHelpOrderController from '../app/controllers/AnswerHelpOrderController';

const router = new Router();

router.post('/:id/help-orders', HelpOrdersController.store);
router.get('/:id/help-orders', HelpOrdersController.index);

router.use(authMiddleware);

router.post('', StudentsController.store);
router.put('', StudentsController.update);
router.post('/:id/checkins', CheckinController.store);
router.get('/:id/checkins', CheckinController.index);

router.post('/help-orders/:id/answer', AnswerHelpOrderController.store);
router.get('/help-orders/', AnswerHelpOrderController.index);

export default router;
