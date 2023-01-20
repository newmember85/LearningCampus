import { Router, Request, Response } from 'express';
import FakultyController from './controller';
import * as faculty_validator from '../../validations/faculty'
import { checkLecturerRole } from '../../auth/checkIsLoggedIn';
import validate from '../../middleware/validate';
const fakultyRouter = Router();

fakultyRouter.get('/', FakultyController.getAll);
fakultyRouter.get('/:name', FakultyController.getAlldegreeProgramme)

fakultyRouter.post('/', validate(faculty_validator.faculty_create), FakultyController.create);
fakultyRouter.put('/:name', checkLecturerRole, validate(faculty_validator.faculty_update), FakultyController.update);
fakultyRouter.delete('/:name', checkLecturerRole, validate(faculty_validator.faculty_destroy), FakultyController.destroy);


export default fakultyRouter;
