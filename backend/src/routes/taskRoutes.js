import { Router } from 'express';
import TaskController from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const taskRouter = Router();

taskRouter.route('/').post(TaskController.create);

taskRouter.route('/').get(TaskController.readAll);

taskRouter.route('/user').get(auth, TaskController.readByUserId);

taskRouter.route('/:id').get(TaskController.readOne);

taskRouter.route('/:id').put(TaskController.update);

taskRouter.route('/:id').delete(TaskController.delete);

taskRouter.route('/complete/:id').post(auth, TaskController.completeTask);

export default taskRouter;