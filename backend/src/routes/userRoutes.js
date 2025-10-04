import { Router } from 'express';
import { UserController } from '../controllers/index.js';;

const userRouter = Router();

userRouter.route('/').post(UserController.create);

userRouter.route('/').get(UserController.readAllUsers);

userRouter.route('/:id').put(UserController.update);

userRouter.route('/:id').delete(UserController.delete);

export default userRouter;