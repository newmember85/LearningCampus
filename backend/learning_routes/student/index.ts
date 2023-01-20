import { Router } from 'express';
import StudentController from './controller';
import * as student_validate from '../../validations/student';
import validate from '../../middleware/validate';
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const studentRouter = Router();


studentRouter.get('/all', checkLecturerRole, StudentController.getStudents);
studentRouter.get('/verify', checkIsLoggedIn, StudentController.roleRequestStudent)
studentRouter.get('/', checkIsLoggedIn, StudentController.getStudent);

studentRouter.post('/', validate(student_validate.student_create), StudentController.create)
studentRouter.put('/:matrikel_nr', checkLecturerRole, validate(student_validate.student_update), StudentController.update);
studentRouter.delete('/:matrikel_nr', checkLecturerRole, validate(student_validate.student_destroy), StudentController.destroy)

export default studentRouter;
