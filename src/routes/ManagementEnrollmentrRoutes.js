import { Router } from 'express';

import GestaoMatriculasController from '../app/controllers/ManagementEnrollmentController';

const router = new Router();

router.post('', GestaoMatriculasController.store);
router.get('', GestaoMatriculasController.index);
router.put('', GestaoMatriculasController.update);
router.delete('/:id', GestaoMatriculasController.delete);

export default router;
