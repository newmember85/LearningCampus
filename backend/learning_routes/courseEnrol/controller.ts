import { Request, Response, NextFunction } from 'express';
import { CourseContent, Courses, Student } from '../../database/models';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import sequelizeConnection from '../../database/config';
import returnUser from '../checkUser';

const courseEnrolContentontroller = {
  async getMyEnrollment(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    if (student) {
      const student_enrol = await sequelizeConnection.query('SELECT ST.username AS Username,C.name AS Course_Name,CE.createdAT AS Enrollment_time FROM Students ST \
      JOIN Course_Enrollment CE ON (ST.matrikel_nr=CE.StudentMatrikelNr) \
      JOIN Courses C ON (C.id = CE.CourseId) \
      WHERE ST.matrikel_nr = :matrikel_nr',
        {
          replacements: { matrikel_nr: student.matrikel_nr },
          type: QueryTypes.SELECT
        }
      );
      response.json(student_enrol)
    } else {
      response.status(400).send({
        status: 'Error'
      });
    }

  },

  async getAll(request: Request, response: Response): Promise<void> {
    const enrol = await sequelizeConnection.query('select * from Course_Enrollment',
      {
        type: QueryTypes.SELECT
      }
    );
    response.json(enrol);
  },
  async getByNr(request: Request, response: Response): Promise<void> {
    const matrikel_nr = request.params.id;
    const student_enrol = await sequelizeConnection.query('SELECT * FROM Course_Enrollment WHERE StudentMatrikelNr = :matrikel_nr',
      {
        replacements: { matrikel_nr: matrikel_nr },
        type: QueryTypes.SELECT
      }
    );
    response.json(student_enrol);

  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const { matrikel_nr, course } = request.body;

      const studentModell = await Student.findByPk(matrikel_nr);
      const courseModell = await Courses.findOne({ where: { name: course, degreeProgramme_id: studentModell?.degree_id } });


      if (studentModell && courseModell) {
        const enrol = await sequelizeConnection.query('SELECT * FROM Course_Enrollment WHERE StudentMatrikelNr = :matrikel_nr and CourseId=:course_id',
          {
            replacements: { matrikel_nr: matrikel_nr, course_id: courseModell.id },
            type: QueryTypes.SELECT
          }
        );
        enrol.length == 0 ? await studentModell.addCourse(courseModell) && response.status(200).send({
          status: 'success',
          message: `Is enrolled`
        }) : response.status(404).send({
          status: 'error',
          message: `Is already enrolled`
        });
      } else {
        response.status(404).send({
          status: 'error',
          message: request.body
        });
      }
    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = returnUser(request);
      const course_Name = request.params.name;

      const studentModell = await Student.findOne({ where: { matrikel_nr: user.id } })
      if (studentModell) {
        const courseModell = await Courses.findOne({ where: { name: course_Name, degreeProgramme_id: studentModell?.degree_id } });

        if (studentModell && courseModell) {
          const enrol = await sequelizeConnection.query('SELECT * FROM Course_Enrollment WHERE StudentMatrikelNr = :matrikel_nr and CourseId = :course_ID',
            {
              replacements: { matrikel_nr: user.id, course_ID: courseModell.id },
              type: QueryTypes.SELECT
            }
          );
          if (enrol.length == 0) {
            response.status(404).send({
              status: 'error',
              message: `No Enrollment found for ${user.id} and Course ${course_Name}`
            });
          } else {
            const deleted_enrollment = await studentModell.removeCourse(courseModell);
            if (deleted_enrollment) {
              response.status(200).send({
                status: 'success'
              });
            }
          }
        }
      } else {
        response.status(400).send({
          status: 'Error'
        });
      }


    } catch (error) {
      next(error);
    }
  }
};

export default courseEnrolContentontroller;
