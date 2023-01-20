import { Router } from 'express';
import courseEnrolContentontroller from './controller';
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const courseEnrolRouter = Router();

courseEnrolRouter.get('/all', checkLecturerRole, courseEnrolContentontroller.getAll);

courseEnrolRouter.get('/', checkIsLoggedIn, courseEnrolContentontroller.getMyEnrollment);

courseEnrolRouter.post('/', courseEnrolContentontroller.create);
courseEnrolRouter.delete('/:name', checkLecturerRole, checkIsLoggedIn, courseEnrolContentontroller.destroy);


export default courseEnrolRouter;
