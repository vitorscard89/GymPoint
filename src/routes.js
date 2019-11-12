import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authModdleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationsController from './app/controllers/RegistrationsController';
import CheckinController from './app/controllers/CheckinsController';
import HelpOrderController from './app/controllers/HelpOrdersController';

const routes = new Router();
const upload = multer(multerConfig);
routes.get('/', (req, res) => {
  return res.status(200).json({ ok: true });
});
routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.post('/student/:id/checkins', CheckinController.store);
routes.get('/student/:id/checkins', CheckinController.index);
routes.post('/student/:id/help-orders', HelpOrderController.store);
routes.get('/student/:id/help-orders', HelpOrderController.index);

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
routes.get('/registration/:id', RegistrationsController.show);
routes.put('/registration/:id', RegistrationsController.update);
routes.delete('/registration/:id', RegistrationsController.delete);

routes.post('help-orders/:id/answer', HelpOrderController.update);

export default routes;
