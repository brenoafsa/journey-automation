import { Router } from 'express';
import TaskController from '../controllers/taskController.js';

const taskRouter = Router();

taskRouter.route('/').post(TaskController.create);

taskRouter.route('/').get(TaskController.readAll);

taskRouter.route('/:id').get(TaskController.readOne);

taskRouter.route('/:id').put(TaskController.update);

taskRouter.route('/:id').delete(TaskController.delete);

taskRouter.route('/complete/:id').post(TaskController.completeTask);

export default taskRouter;