import { Router } from 'express';

import ManagementEnroullmentController from '../app/controllers/ManagementEnrollmentController';

const router = new Router();

router.post('', ManagementEnroullmentController.store);
router.get('', ManagementEnroullmentController.index);
router.put('', ManagementEnroullmentController.update);
router.delete('/:id', ManagementEnroullmentController.delete);

export default router;
