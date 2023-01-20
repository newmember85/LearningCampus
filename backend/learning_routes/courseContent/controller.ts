import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import { CourseContent, Courses, DegreeProgramme, Lecturer, Student } from '../../database/models';
import courseContentModel from '../../database/models/course_content';
import returnUser from '../checkUser';

const courseContentontroller = {
  async getAll(request: Request, response: Response): Promise<void> {
    const content = await CourseContent.findAll();
    response.json(content);
  },

  async getCourseContent(request: Request, response: Response): Promise<void> {
    const { course, degree } = request.query;
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    const lecturerObj = await Lecturer.findOne({ where: { id: user.id } })
    if (student) {
      const degreeProgramme_id = (user) ? await DegreeProgramme.findOne({ where: { id: student?.degree_id } }) : null;
      if (degreeProgramme_id === null) {
        response.status(409).send({
          status: 'Error',
          data: "Degree not found"
        });
      } else {
        const courseObj = await Courses.findOne({
          where: {
            id: course,
            degreeProgramme_id: degreeProgramme_id?.id
          }
        });
        if (!courseObj || courseObj === null) {
          response.status(400).send({
            status: 'error',
            message: `No Course found`
          });
        } else {
          const course_content = await CourseContent.findAll({
            include: [{
              model: Courses,
              where: {
                name: courseObj?.name,
                degreeProgramme_id: degreeProgramme_id?.id
              }
            }]
          });
          response.json(course_content);
        };

      }
    } else if (lecturerObj) {
      const courseDetails = await sequelizeConnection.query('select cc.title,cc.text from CourseContents cc JOIN Courses c on (cc.course_id=c.id) JOIN  Lectures lec on (lec.course_id=c.id) JOIN Lecturers l on (l.id=lec.lecturer_id) where c.id = :course;',
        {
          replacements: { course: course },
          type: QueryTypes.SELECT
        }
      );
      response.json(courseDetails)
    } else {
      response.status(404).send({
        status: 'Error'
      });
    }


  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { title, text, content_type, url_path, course, degree } = request.body;
      const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;
      if (degreeProgramme_id === null) {
        response.status(409).send({
          status: 'Error',
          data: "Degree not found"
        });
      } else {
        const course_model = await Courses.findOne({
          where: {
            name: course,
            degreeProgramme_id: degreeProgramme_id?.id
          }
        });
        const course_id = (course_model !== null) ? course_model.id : null;
        if (course_id) {
          await CourseContent.create({
            title: title,
            text: text,
            content_type: content_type,
            url_path: url_path,
            course_id: course_id
          })
          response.status(201).send({
            status: 'success',
            data: request.body
          });
        } else {
          response.status(400).send({
            status: 'error',
            message: `No Course found`
          });

        }
      }

    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const content_id = request.params.id;
      const { titel, text, content_type, url_path } = request.body;

      const content = await CourseContent.findByPk(content_id);
      if (content === null) {
        response.status(404).send({
          status: 'error',
          message: `CourseContent not found`
        });
      } else {
        if (titel) content.titel = titel;
        if (text) content.text = text;
        if (content_type) content.content_type = content_type;
        if (url_path) content.url_path = url_path

        await content.save();
        response.status(200).send({
          status: 'success',
          message: request.body
        });
      }

    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const content_id = request.params.id;
      const content = await CourseContent.findByPk(content_id);
      if (content !== null) {
        await content.destroy();
        response.status(200).send({
          status: 'success',
          message: `CourseContent deleted`
        });
      } else {
        response.status(404).send({
          status: 'error',
          message: `CourseContent not found`
        });
      }


    } catch (error) {
      next(error);
    }
  }
};

export default courseContentontroller;
