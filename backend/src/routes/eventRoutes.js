import { Router } from 'express';
import EventController from '../controllers/eventController.js';

const eventRouter = Router();

eventRouter.route('/').post(EventController.create);

eventRouter.route('/').get(EventController.readAll);

eventRouter.route('/:id').get(EventController.readOne);

eventRouter.route('/:id').put(EventController.update);

eventRouter.route('/:id').delete(EventController.delete);

eventRouter.route('/respond/:eventId').post(EventController.respondInvitation);

export default eventRouter;