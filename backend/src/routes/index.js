import { Router } from 'express';
import UserRouter from './userRoutes.js';

const router = Router();

router.use('/user', UserRouter);

router.route('/').get((_, res) => {
  res.status(200).send('API inicializada!');
});

export default router;