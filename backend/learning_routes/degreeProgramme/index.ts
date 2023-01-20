import { Router } from 'express';
import degreeProgrammController from './controller';
import validate from '../../middleware/validate';
import * as degreeProgramm_validator from '../../validations/degreeProgramme'
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const degreeProgrammRouter = Router();

degreeProgrammRouter.get('/', checkIsLoggedIn, degreeProgrammController.getDegree);
degreeProgrammRouter.get('/all', degreeProgrammController.getAll);

degreeProgrammRouter.post('/', validate(degreeProgramm_validator.degreeProgramm_create), degreeProgrammController.create);
degreeProgrammRouter.put('/:name', checkLecturerRole, validate(degreeProgramm_validator.degreeProgramm_update), degreeProgrammController.update);
degreeProgrammRouter.delete('/:name', checkLecturerRole, validate(degreeProgramm_validator.degreeProgramm_destroy), degreeProgrammController.destroy);
export default degreeProgrammRouter;
