import { Router } from 'express';
import courseContentController from './controller';
import validate from '../../middleware/validate';
import * as content_validate from '../../validations/courseContent'
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const courseContentRouter = Router();

courseContentRouter.get('/', checkIsLoggedIn, courseContentController.getCourseContent);
courseContentRouter.get('/all', courseContentController.getAll);

courseContentRouter.post('/', validate(content_validate.courseContent_create), courseContentController.create);
courseContentRouter.put('/id=:id', checkLecturerRole, validate(content_validate.courseContent_update), courseContentController.update);
courseContentRouter.delete('/id=:id', checkLecturerRole, validate(content_validate.courseContent_destroy), courseContentController.destroy);


export default courseContentRouter;
