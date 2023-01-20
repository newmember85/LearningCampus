import { Router } from 'express';
import courseController from './controller';
import validate from '../../middleware/validate';
import * as course_validate from '../../validations/course'
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const courseRouter = Router();

courseRouter.get('/', checkIsLoggedIn, courseController.getCoursesFromDegree);
courseRouter.get('/FWPM', checkIsLoggedIn, courseController.getValidFWPM);
courseRouter.get('/all', courseController.getAll);
courseRouter.get('/:id', checkIsLoggedIn, courseController.getCourseDetails);

courseRouter.post('/', validate(course_validate.course_create), courseController.create);
courseRouter.put('/', checkLecturerRole, validate(course_validate.course_update), courseController.update);
courseRouter.delete('/', checkLecturerRole, validate(course_validate.course_destroy), courseController.destroy);


export default courseRouter;
