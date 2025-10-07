import { Router } from 'express';
import EventController from '../controllers/eventController.js';
import auth from '../middlewares/auth.js';

const eventRouter = Router();

eventRouter.route('/').post(auth, EventController.create);

eventRouter.route('/').get(auth, EventController.readAll);

eventRouter.route('/user').get(auth, EventController.readByUserId);

eventRouter.route('/:id').get(auth, EventController.readOne);

eventRouter.route('/:id').put(auth, EventController.update);

eventRouter.route('/:id').delete(auth, EventController.delete);

eventRouter.route('/respond/:id').post(auth, EventController.respondInvitation);

export default eventRouter;