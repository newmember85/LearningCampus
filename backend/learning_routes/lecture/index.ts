import { Router, Request, Response } from 'express';
import LectureController from './controller'
import validate from '../../middleware/validate';
import * as lecture_validate from '../../validations/lecture';
import { checkLecturerRole } from '../../auth/checkIsLoggedIn';
const LectureRouter = Router();

LectureRouter.get('/', LectureController.getAll);
LectureRouter.post('/', validate(lecture_validate.lecture_create), LectureController.create)

LectureRouter.put('/', checkLecturerRole, validate(lecture_validate.lecture_update), LectureController.update);
LectureRouter.delete('/', checkLecturerRole, validate(lecture_validate.lecture_destroy), LectureController.destroy)
export default LectureRouter;
