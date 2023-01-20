import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import { DegreeProgramme, Lecture, Lecturer, Student } from '../../database/models';
import Courses from '../../database/models/courses';
import courseModel from '../../database/models/courses';
import Location from '../../database/models/location';
import returnUser from '../checkUser';

const courseController = {
  async getAll(request: Request, response: Response): Promise<void> {
    const coures = await courseModel.findAll();
    response.json(coures);
  },
  async getCourseBuilding(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    if (student !== null) {
      const degreeProgramme = (user) ? await DegreeProgramme.findOne({ where: { id: student?.degree_id } }) : null;
      const course = await courseModel.findOne({ where: { name: request.params.name, degreeProgramme_id: degreeProgramme?.id } });
      if (course !== null) {
        const lectures = await Lecture.findOne({ where: { course_id: course?.id } })
        const location = await Location.findOne({ where: { id: lectures?.location_id } })
        response.json({ day: location?.day, room: location?.shortname });
      } else {
        response.status(409).send({
          status: 'Error',
          data: "Course not found"
        });
      }
    } else {
      response.status(409).send({
        status: 'Error',
        data: "Student not found"
      });
    }


  },

  async getCoursesFromDegree(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    const lecturerObj = await Lecturer.findOne({ where: { id: user.id } })
    if (student) {
      const course = await sequelizeConnection.query('\
      SELECT course.* FROM Fakulties faktu \
      JOIN DegreeProgrammes degree ON(faktu.id = degree.fakulty_id) \
      JOIN Courses course on (course.degreeProgramme_id= degree.id) \
      JOIN Students st ON(degree.Id = st.degree_id) \
      WHERE st.matrikel_nr = :matrikel_nr; ',
        {
          replacements: { matrikel_nr: user.id },
          type: QueryTypes.SELECT
        }
      );
      response.json(course);
    }
    else if (lecturerObj) {
      const course = await sequelizeConnection.query('select distinct c.name,c.abbreviation,c.semester,c.is_fwpm from Lectures lec JOIN Lecturers l ON (lec.lecturer_id = l.id) JOIN Courses c on (c.id = lec.course_id) where l.id= :user_id group by c.name,c.abbreviation,c.semester,c.is_fwpm; ',
        {
          replacements: { user_id: user.id },
          type: QueryTypes.SELECT
        }
      );
      response.json(course);
    }
    else {
      response.status(409).send({
        status: 'Error',
        data: "Student not found"
      });
    }

  },
  async getValidFWPM(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);

    const student = await Student.findByPk(user.id);
    if (student !== null) {
      const fwpm_valid = await Courses.findAll({ where: { is_fwpm: 1, degreeProgramme_id: student?.degree_id } });

      response.json(fwpm_valid);
    } else {
      response.status(409).send({
        status: 'Error',
        data: "Student not found"
      });
    }

  },
  async getCourseDetails(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    const lecturerObj = await Lecturer.findOne({ where: { id: user.id } })
    if (student !== null) {
      const degreeProgramme = (user) ? await DegreeProgramme.findOne({ where: { id: student?.degree_id } }) : null;
      const course_id = request.params.id;

      const courseObj = (course_id) ? await Courses.findOne({ where: { id: course_id } }) : null;
      if (courseObj) {
        const courseDetails = await sequelizeConnection.query('SELECT DISTINCT CONCAT(IF(lec.title!="null",lec.title,""),lec.surname," ",lec.name) as name,c.name as CourseName,c.abbreviation,c.semester,c.is_fwpm,l.time_range,l.day,loc.shortname,ST_X(geometry) as x_coord, ST_Y(geometry) as y_coord FROM Courses c JOIN Lectures l ON (c.id = l.course_id) JOIN Locations loc ON (loc.id = l.location_id) JOIN Lecturers lec ON (lec.id = l.lecturer_id) WHERE c.id = :course_id AND c.degreeProgramme_id = :degree_id',
          {
            replacements: { course_id: courseObj.id, degree_id: degreeProgramme?.id },
            type: QueryTypes.SELECT
          }
        );
        response.json(courseDetails)
      } else {
        response.status(404).send({
          status: 'Error'
        });
      }
    } else if (lecturerObj) {
      const course_id = request.params.id;

      const courseObj = (course_id) ? await Courses.findOne({ where: { id: course_id } }) : null;
      if (courseObj) {
        const courseDetails = await sequelizeConnection.query('SELECT DISTINCT CONCAT(IF(lec.title!="null",lec.title,""),lec.surname," ",lec.name) as name,c.name as CourseName,c.abbreviation,c.semester,c.is_fwpm,l.time_range,l.day,loc.shortname,ST_X(geometry) as x_coord, ST_Y(geometry) as y_coord FROM Courses c JOIN Lectures l ON (c.id = l.course_id) JOIN Locations loc ON (loc.id = l.location_id) JOIN Lecturers lec ON (lec.id = l.lecturer_id) WHERE c.id = :course_id',
          {
            replacements: { course_id: courseObj.id },
            type: QueryTypes.SELECT
          }
        );
        response.json(courseDetails)

      } else {
        response.status(409).send({
          status: 'Error',
          data: "Course not found"
        });
      }
    } else {
      response.status(404).send({
        status: 'Error'
      });
    }
  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const { name, abbreviation, semester, is_fwpm, degreeProgramme } = request.body;
      const degreeProgramme_id = (degreeProgramme) ? await DegreeProgramme.findOne({ where: { name: degreeProgramme } }) : null;
      const nameOnlyValue = name.split(", ")
      if (degreeProgramme_id === null) {
        response.status(400).send({
          status: 'Error',
          data: "Degree not found"
        })
      } else {
        const course = await Courses.findOne({
          where: {
            name: nameOnlyValue[0],
            degreeProgramme_id: degreeProgramme_id?.id
          }
        });

        if (course) {
          response.status(409).send({
            status: 'Error',
            data: "Course already exists"
          });
        } else {
          if (degreeProgramme_id === null && !is_fwpm) {
            response.status(400).send({
              status: 'Error',
              data: request.body
            });
          } else {
            await Courses.create({
              name: nameOnlyValue[0],
              abbreviation: abbreviation,
              semester: semester,
              is_fwpm: is_fwpm,
              degreeProgramme_id: degreeProgramme_id?.id,
            });

            response.status(201).send({
              status: 'success',
              data: request.body
            });
          }
        }
      }


    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { course, degree } = request.query;
      const { name, abbreviation, semester, is_fwpm, degreeProgramme } = request.body;


      const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;
      if (degreeProgramme_id === null) {
        response.status(409).send({
          status: 'Error',
          data: "Degree not found"
        });
      }
      const courseObj = await Courses.findOne({
        where: {
          name: course,
          degreeProgramme_id: degreeProgramme_id?.id
        }
      });

      if (courseObj === null) {
        response.status(409).send({
          status: 'Error',
          data: "Course was not found"
        });
      } else {
        if (name) courseObj.name = name;
        if (abbreviation) courseObj.abbreviation = abbreviation;
        if (semester) courseObj.semester = semester;
        if (is_fwpm) courseObj.is_fwpm = is_fwpm;

        const degreeProgramme_id = (degreeProgramme) ? await DegreeProgramme.findOne({ where: { name: degreeProgramme } }) : null;

        if (degreeProgramme_id) courseObj.degreeProgramme_id = degreeProgramme_id.id;

        const course_update = (name) ? await Courses.findOne({
          where: {
            name: name
          }
        }) : false;

        if (course_update) {
          response.status(409).send({
            status: 'Error',
            data: "Course already exists"
          });
        } else {
          await courseObj.save();
          response.status(200).send({
            status: 'success',
            message: request.body
          });
        }


      }
    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { course, degree } = request.query;
      const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;
      if (degreeProgramme_id === null) {
        response.status(409).send({
          status: 'Error',
          data: "Degree not found"
        });
      }
      const courseObj = await Courses.findOne({
        where: {
          name: course,
          degreeProgramme_id: degreeProgramme_id?.id
        }
      });

      if (courseObj === null) {
        response.status(409).send({
          status: 'Error',
          data: "Course was not found"
        });
      } else {
        await courseObj.destroy();
        response.status(200).send({
          status: 'success',
          message: `Course deleted`
        });
      }


    } catch (error) {
      next(error);
    }
  }
};

export default courseController;
