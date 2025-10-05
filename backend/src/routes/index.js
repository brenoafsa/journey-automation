import { Router } from 'express';
import userRouter from './userRoutes.js';
import eventRouter from './eventRoutes.js';

const router = Router();

router.use('/user', userRouter);
router.use('/event', eventRouter);

router.route('/').get((_, res) => {
  res.status(200).send('API inicializada!');
});

export default router;