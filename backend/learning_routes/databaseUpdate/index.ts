import { Router } from 'express';
import databaseUpdateController from './controller';
import { checkLecturerRole } from '../../auth/checkIsLoggedIn';
const databaseRouter = Router();

databaseRouter.post('/', checkLecturerRole, databaseUpdateController.updateDatabase);

export default databaseRouter;
