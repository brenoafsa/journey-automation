import { Router } from 'express';
import EventController from '../controllers/eventController.js';
import auth from '../middlewares/auth.js';

const eventRouter = Router();

eventRouter.route('/').post(auth, EventController.create);

eventRouter.route('/').get(EventController.readAll);

eventRouter.route('/user').get(auth, EventController.readByUserId);

eventRouter.route('/:id').get(EventController.readOne);

eventRouter.route('/:id').put(EventController.update);

eventRouter.route('/:id').delete(EventController.delete);

eventRouter.route('/respond/:id').post(auth, EventController.respondInvitation);

export default eventRouter;