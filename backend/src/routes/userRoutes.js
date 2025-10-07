import { Router } from 'express';
import UserController from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const userRouter = Router();

userRouter.route('/').post(UserController.create);

userRouter.route('/login').post(UserController.checkCredentials);

userRouter.route('/').get(UserController.readAll);

userRouter.get('/me', auth, UserController.readUserById);

userRouter.route('/:id').put(UserController.update);

userRouter.route('/:id').delete(UserController.delete);

export default userRouter;