import { Router } from 'express';
import UserController from '../app/controllers/UserController';

const router = new Router();

router.put('', UserController.update);

export default router;
