import { Router } from 'express';
import LecturerController from './controller'
import validate from '../../middleware/validate';
import * as lecturer_validate from '../../validations/lecturer';
import { checkLecturerRole } from '../../auth/checkIsLoggedIn';
const LecturerRouter = Router();

LecturerRouter.get('/', checkLecturerRole, LecturerController.getAll);

LecturerRouter.post('/', validate(lecturer_validate.lecturer_create), LecturerController.create)
LecturerRouter.put('/', checkLecturerRole, validate(lecturer_validate.lecturer_update), LecturerController.update);
LecturerRouter.delete('/', checkLecturerRole, validate(lecturer_validate.lecturer_destroy), LecturerController.destroy)

export default LecturerRouter;
