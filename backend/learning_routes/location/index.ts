import { Router } from 'express';
import LocationController from './controller';
import * as student_validate from '../../validations/student';
import validate from '../../middleware/validate';
import {checkIsLoggedIn} from '../../auth/checkIsLoggedIn';
const locationRouter = Router();

locationRouter.get('/buildings', LocationController.getAllBuildings);
locationRouter.get('/:name', LocationController.getGeometryByBuilding);

export default locationRouter;
