import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import sequelizeConnection from '../../database/config';
import Fakulty from '../../database/models/faculty';

const FakultyController = {

  async getAll(request: Request, response: Response): Promise<void> {
    const faculty = await Fakulty.findAll();
    response.json(faculty);
  },

  async getAlldegreeProgramme(request: Request, response: Response): Promise<void> {

    const faculty = await sequelizeConnection.query('select * from Fakulties faku join DegreeProgrammes degree on (faku.id=degree.fakulty_id) WHERE faku.name = :faku_name;',
      {
        replacements: { faku_name: request.params.name },
        type: QueryTypes.SELECT
      }
    );

    if (faculty.length <= 0) {
      response.status(404).send({
        status: 'error',
        message: `No DegreeProgrammes for ${request.params.name} Faculty found`
      });
    } else {
      response.status(200).send({
        status: 'success',
        data: faculty
      });
    }
  },


  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const faculty = await Fakulty.findAll({
        where: {
          name: request.body.name
        }
      });
      if (faculty.length > 0) {
        response.status(409).send('Error')
      } else {

        await Fakulty.create(request.body)
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

      const next_name = request.body.name;

      const faculty = await Fakulty.findOne({
        where: {
          name: current_name
        }
      });
      if (!faculty) {
        response.status(404).send({
          status: 'error',
          message: `Faculty with name ${current_name} not found`
        });

      } else {
        if (next_name) faculty.name = next_name;
        const checkupdatedFaculty = await Fakulty.findOne({
          where: {
            name: next_name
          }
        });
        if (checkupdatedFaculty) {
          response.status(404).send({
            status: 'error',
            message: `Faculty with name ${next_name} already exists`
          });
        } else {
          const updateFaculty = await faculty.save();
          if (!updateFaculty) {
            response.status(400).send({
              status: 'error',
              message: `Faculty with name ${current_name} failed update`
            });
          }
        }
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
      const name = request.params.name;
      const faculty = await Fakulty.findOne({
        where: {
          name: name
        }
      });

      if (!faculty) {
        response.status(404).send({
          status: 'error',
          message: `Faculty with ${name} not found`
        });
      } else {
        const deletefaculty = await faculty?.destroy();
        if (deletefaculty === null) {
          response.status(503).send({
            status: 'error',
            message: `Faculty with ${name} failed delete`
          });
        } else {
          response.status(200).send({
            status: 'success',
            message: `Faculty with ${name} deleted`
          });
        }
      }

    } catch (error) {
      next(error);
    }
  }

}
export default FakultyController;