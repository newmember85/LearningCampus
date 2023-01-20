import { Router } from 'express';
import authController from './controller';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/token', authController.token);


export default authRouter;