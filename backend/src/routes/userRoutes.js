import { Router } from 'express';
import UserController from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const userRouter = Router();

userRouter.route('/').post(UserController.create);

userRouter.route('/login').post(UserController.checkCredentials);

userRouter.route('/').get(auth, UserController.readAll);

userRouter.route('/me').get(auth, UserController.readUserById);

userRouter.route('/:id').put(auth, UserController.update);

userRouter.route('/:id').delete(auth, UserController.delete);

export default userRouter;