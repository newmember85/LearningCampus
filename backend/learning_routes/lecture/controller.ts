import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import { Courses, DegreeProgramme, Lecture, Lecturer } from '../../database/models';
import Location from '../../database/models/location';

const lectureController = {


  async getAll(request: Request, response: Response): Promise<void> {
    const lectures = await Lecture.findAll();
    response.json(lectures);
  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const { time_range, day, course, degree, lecturer, location } = request.body;
      const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;
      const nameOnlyValue = course.split(", ")

      const lecture = await sequelizeConnection.query('select * from Lectures vl join Courses c on (vl.course_id=c.id) join Lecturers dz on (vl.lecturer_id =dz.id) join Locations lc on (vl.location_id=lc.id) where c.name= :course_name and dz.username= :lecturer_name and lc.shortname= :location_short_name and vl.day= :day and vl.time_range= :time_range and c.degreeProgramme_id= :degree;',
        {
          replacements: { course_name: nameOnlyValue[0], lecturer_name: lecturer, location_short_name: location, day: day, time_range: time_range, degree: degreeProgramme_id?.id },
          type: QueryTypes.SELECT
        }
      );
      if (lecture.length > 0) {
        response.status(409).send({
          status: 'Error',
          data: "Lecture already exists"
        });
      } else {
        const degreeProgramme_id = (degree) ? await DegreeProgramme.findOne({ where: { name: degree } }) : null;

        const lecture_course = await Courses.findOne({
          where: {
            name: nameOnlyValue[0],
            degreeProgramme_id: degreeProgramme_id?.id
          }
        });
        const lecture_lecturer = await Lecturer.findOne({
          where: {
            username: lecturer
          }
        });
        const lecture_location = await Location.findOne({
          where: {
            shortname: location
          }
        });

        if (lecture_course === null || lecture_lecturer === null || lecture_location === null || time_range === null || day === null) {
          response.status(400).send({
            status: 'Error',
            data: request.body
          });
        } else {
          await Lecture.create({
            time_range: time_range,
            day: day,
            course_id: lecture_course.id,
            location_id: lecture_location.id,
            lecturer_id: lecture_lecturer.id,
          });
          response.status(201).send({
            status: 'success',
            data: request.body
          });
        }
      }

    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const { time_range, day, lecturer, location } = request.body;


      const course_name = request.query.name;
      const lecturer_name = request.query.lecturer;
      const lecture_day = request.query.day;
      const lecture_time_range = request.query.range;


      const lecture_course = await Courses.findOne({
        where: {
          name: course_name
        }
      });

      const lecture_lecturer = await Lecturer.findOne({
        where: {
          username: lecturer_name
        }
      });

      if (lecture_course === null || lecture_lecturer === null) {
        response.status(409).send({
          status: 'Error',
          data: "Course or Lecturer not found"
        });
      }
      const lecture = await Lecture.findOne({
        where: {
          course_id: lecture_course?.id,
          lecturer_id: lecture_lecturer?.id,
          day: lecture_day,
          time_range: lecture_time_range
        }
      })

      if (lecture === null) {
        response.status(409).send({
          status: 'Error',
          data: "lecture was not found"
        });
      } else {
        if (time_range) lecture.time_range = time_range;
        if (day) lecture.day = day;


        if (lecturer) {
          const lecture_update = await Lecturer.findOne({
            where: {
              username: lecturer
            }
          });
          if (lecture_update) lecture.lecturer_id = lecture_update.id;
        }
        if (location) {
          const lecture_location = await Location.findOne({
            where: {
              shortname: location
            }
          });
          if (lecture_location) lecture.location_id = lecture_location.id
        }




        await lecture.save();
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

      const course_name = request.query.name;
      const lecturer_name = request.query.lecturer;
      const lecture_day = request.query.day;
      const lecture_time_range = request.query.range;


      const lecture_course = await Courses.findOne({
        where: {
          name: course_name
        }
      });

      const lecture_lecturer = await Lecturer.findOne({
        where: {
          username: lecturer_name
        }
      });


      const lecture = await Lecture.findOne({
        where: {
          course_id: lecture_course?.id,
          lecturer_id: lecture_lecturer?.id,
          day: lecture_day,
          time_range: lecture_time_range
        }
      })

      if (lecture === null) {
        response.status(409).send({
          status: 'Error',
          data: "lecture was not found"
        });
      } else {
        await lecture.destroy();
        response.status(200).send({
          status: 'success',
          message: `lecture deleted`
        });
      }


    } catch (error) {
      next(error);
    }
  }
};

export default lectureController;
