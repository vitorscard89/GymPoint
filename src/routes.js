import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authModdleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationsController from './app/controllers/RegistrationsController';

const routes = new Router();
const upload = multer(multerConfig);
routes.get('/', (req, res) => {
  return res.status(200).json({ ok: true });
});
routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authModdleware);
routes.post('/files', upload.single('files'), (req, res) => {
  return res.json({ ok: true });
});
routes.put('/user', UserController.update);
routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.post('/registration', RegistrationsController.store);
routes.get('/registration', RegistrationsController.index);
routes.put('/registration/:id', RegistrationsController.update);
routes.delete('/registration/:id', RegistrationsController.delete);

export default routes;
