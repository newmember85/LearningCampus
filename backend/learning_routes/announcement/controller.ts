import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import { Courses, DegreeProgramme, Lecturer, Student } from '../../database/models';
import Announcement from '../../database/models/announcement';
import returnUser from '../checkUser';

const announcementController = {

  // Returns all announcements for enrolled courses
  async getMyAnnouncements(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    if (user) {
      const student = await Student.findOne({
        where: {
          matrikel_nr: user.id
        },
        include: [{ model: Courses }]
      });
      if (student) {
        const courses_array = []
        for (const element of student?.Courses) {
          courses_array.push(element.id)
        };
        const announcement = await Announcement.findAll({
          where: {
            course_id: courses_array
          }
        });
        response.json(announcement);
      } else {
        response.status(400).send({
          status: 'Error'
        });
      }

    } else {
      response.status(400).send({
        status: 'Error'
      });
    }

  },

  async getALL(request: Request, response: Response): Promise<void> {
    const announcements = await sequelizeConnection.query('SELECT CONCAT(IF(l.title!="null",l.title,""),l.surname," ",l.name) as Name,a.title,a.text,date_format(updatedAt,"%d.%m.%Y") as Date FROM Announcements a join Lecturers l ON (a.lecturer_id = l.id) ',
      {
        type: QueryTypes.SELECT
      }
    );
    response.json(announcements)
  },

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = returnUser(request)
      const lecturerObj = await Lecturer.findOne({ where: { id: user.id } })
      if (lecturerObj) {
        const { title, text, course, degree } = request.body
        const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;
        const courseObj = await Courses.findOne({ where: { name: course, degreeProgramme_id: degreeProgramme_id?.id } })

        if (courseObj === null) {
          response.status(404).send({
            status: 'Error',
            message: "No Course found"
          });
        } else {
          await Announcement.create({ title: title, text: text, course_id: courseObj?.id, lecturer_id: lecturerObj.id }) ?
            response.status(200).send({
              status: 'success',
              message: request.body
            }) :
            response.status(400).send({
              status: 'Error',
              data: "Announcement not created"
            });
        }

      }


    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const { text } = request.body;
      const announcement_id = request.params.id;


      const announcement = await Announcement.findByPk(announcement_id)

      if (announcement === null) {
        response.status(404).send({
          status: 'Error',
          data: "Announcement was not found"
        });
      } else {
        if (text) announcement.text = text;

        await announcement.save() ?
          response.status(200).send({
            status: 'success',
            message: request.body
          }) :
          response.status(400).send({
            status: 'Error',
            data: "No Update for Announcement"
          });


      }
    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const announcement = await Announcement.findByPk(request.params.id)

      if (announcement === null) {
        response.status(404).send({
          status: 'Error',
          data: "Announcement was not found"
        });
      } else {
        await announcement.destroy();
        response.status(200).send({
          status: 'success',
          data: "Announcement was deleted"
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

export default announcementController;
