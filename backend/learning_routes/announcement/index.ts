import { Router, Request, Response } from 'express';
import announcementController from './controller';
import validate from '../../middleware/validate';
import * as announcement_validate from '../../validations/announcement';
import { checkIsLoggedIn, checkLecturerRole } from '../../auth/checkIsLoggedIn';
const announcementRouter = Router();

announcementRouter.get('/', checkIsLoggedIn, announcementController.getMyAnnouncements);
announcementRouter.get('/all', announcementController.getALL);


announcementRouter.post('/', checkLecturerRole, validate(announcement_validate.announcement_create), announcementController.create);
announcementRouter.put('/:id', checkLecturerRole, validate(announcement_validate.announcement_update), announcementController.update);
announcementRouter.delete('/:id', checkLecturerRole, validate(announcement_validate.announcement_destroy), announcementController.destroy);


export default announcementRouter;
