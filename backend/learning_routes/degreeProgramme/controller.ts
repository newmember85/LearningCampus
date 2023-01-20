import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import { Fakulty, Student } from '../../database/models';
import degreeProgramm from '../../database/models/degree_programme';
import returnUser from '../checkUser';

const degreeProgrammController = {
  async getAll(request: Request, response: Response): Promise<void> {
    const coures = await degreeProgramm.findAll();
    response.json(coures);
  },
  async getDegree(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    if (student) {
      const degree = await sequelizeConnection.query('SELECT degree.* FROM Fakulties faktu JOIN DegreeProgrammes degree ON(faktu.id = degree.fakulty_id) JOIN Students st ON(degree.Id = st.degree_id) WHERE st.matrikel_nr = :matrikel_nr; ',
        {
          replacements: { matrikel_nr: student.matrikel_nr },
          type: QueryTypes.SELECT
        }
      );
      response.json(degree)
    } else {
      response.status(401).send("Unauthorized")
    }
  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { name, abbreviation, semester_count, splan_id, faculty } = request.body;

      const degree_programme = await degreeProgramm.findAll({
        where: {
          name: request.body.name
        }
      });
      const degree_faculty = (faculty) ? await Fakulty.findOne({
        where: {
          name: faculty
        }
      }) : null;

      if (degree_programme.length > 0) {
        response.status(409).send({
          status: 'error',
          message: `DegreeProgramme with name ${name} already exists or has no valid Faculty`
        });
      } else {
        await degreeProgramm.create({
          name: name,
          abbreviation: abbreviation,
          semester_count: semester_count,
          splan_id: splan_id,
          fakulty_id: degree_faculty?.id
        })
        response.status(201).send({
          status: 'success',
          data: request.body
        });

      }
    } catch (error) {
      next(error);
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const current_name = request.params.name;

      const { next_name, abbreviation, semester_count, splan_id, faculty } = request.body;

      const degree_programme = await degreeProgramm.findOne({
        where: {
          name: current_name
        }
      });
      const degree_faculty = await Fakulty.findOne({
        where: {
          name: faculty
        }
      })
      if (!degree_programme || degree_faculty === null) {
        response.status(404).send({
          status: 'error',
          message: `DegreeProgramme with name ${current_name} not found or Faculty not found`
        });

      } else {

        if (next_name) degree_programme.name = next_name;
        if (abbreviation) degree_programme.abbreviation = abbreviation;
        if (semester_count) degree_programme.semester_count = semester_count;
        if (splan_id) degree_programme.splan_id = splan_id;

        const degree_faculty = (faculty) ? await Fakulty.findOne({
          where: {
            name: faculty
          }
        }) : null;
        if (faculty) degree_programme.fakulty_id = degree_faculty?.id;
        const checkupdatedDegree = (next_name) ? await degreeProgramm.findOne({
          where: {
            name: next_name
          }
        }) : false;
        if (checkupdatedDegree) {
          response.status(404).send({
            status: 'error',
            message: `DegreeProgramme with name ${next_name} already exists`
          });
        } else {
          const updateDegreeProgramme = await degree_programme.save();
          if (!updateDegreeProgramme) {
            response.status(400).send({
              status: 'error',
              message: `DegreeProgramme with name ${current_name} failed update`
            });
          } else {
            response.status(200).send({
              status: 'success',
              message: request.body
            });
          }
        }
      }
    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const name = request.params.name;
      const degree_programme = await degreeProgramm.findOne({
        where: {
          name: name
        }
      });

      if (!degree_programme) {
        response.status(404).send({
          status: 'error',
          message: `DegreeProgramme with ${name} not found`
        });
      }
      const deletedegree = await degree_programme?.destroy();
      if (!deletedegree) {
        response.status(503).send({
          status: 'error',
          message: `DegreeProgramme with ${name} failed delete`
        });
      } else {
        response.status(200).send({
          status: 'success',
          message: `DegreeProgramme with ${name} deleted`
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

export default degreeProgrammController;
