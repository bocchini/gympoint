import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import PlansRoutes from './routes/PlansRoutes';
import ManagementRoutes from './routes/ManagementEnrollmentrRoutes';
import StudentsRoutes from './routes/StudentsRoutes';
import UsesRouter from './routes/UserRoutes';

const routes = new Router();

// Routes don´t neet autentication
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use('/students', StudentsRoutes);

routes.use(authMiddleware);

routes.use('/planos', PlansRoutes);
routes.use('/matriculas', ManagementRoutes);

routes.use('/users', UsesRouter);

export default routes;
