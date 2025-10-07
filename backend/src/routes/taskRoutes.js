import { Router } from 'express';
import TaskController from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const taskRouter = Router();

taskRouter.route('/').post(auth, TaskController.create);

taskRouter.route('/').get(auth, TaskController.readAll);

taskRouter.route('/user').get(auth, TaskController.readByUserId);

taskRouter.route('/:id').get(auth, TaskController.readOne);

taskRouter.route('/:id').put(auth, TaskController.update);

taskRouter.route('/:id').delete(auth, TaskController.delete);

taskRouter.route('/complete/:id').post(auth, TaskController.completeTask);

export default taskRouter;