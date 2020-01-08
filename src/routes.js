import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlanosController from './app/controllers/PlanosController';
import GestaoMatriculasController from './app/controllers/GestaoMatriculasController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.get('/planos', PlanosController.index);
routes.post('/planos', PlanosController.store);
routes.put('/planos', PlanosController.update);
routes.delete('/planos/:id', PlanosController.delete);

routes.post('/matriculas', GestaoMatriculasController.store);
routes.get('/matriculas', GestaoMatriculasController.index);
routes.put('/matriculas', GestaoMatriculasController.update);
routes.delete('/matriculas/:id', GestaoMatriculasController.delete);

export default routes;
