import { Request, Response, NextFunction } from 'express';
import Lecturer from '../../database/models/lecturer';
const LecturerController = {

  async getAll(request: Request, response: Response): Promise<void> {
    const lecturer = await Lecturer.findAll();
    response.json(lecturer);
  },


  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const lecturer = await Lecturer.findAll({
        where: {
          title: request.body.title,
          surname: request.body.surname,
          name: request.body.name
        }
      });
      if (lecturer.length > 0) {
        response.status(409).send({ message: 'Lecturer already exists' })
      } else {
        await Lecturer.create(request.body)
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
      const { current_surname, current_name } = request.query;

      const { surname, name, username, password } = request.body;

      const lecturer = await Lecturer.findOne({
        where: {
          surname: current_surname,
          name: current_name
        }
      });

      if (!lecturer) {
        response.status(404).send({
          status: 'error',
          message: `Lecturer with surname ${current_surname} not found`
        });
      } else {
        if (surname) lecturer.surname = surname;
        if (name) lecturer.name = name;
        if (username) lecturer.username = username;
        if (password) lecturer.password = password;

        const checkupdatedLecturer = await Lecturer.findOne({
          where: {
            surname: surname,
            name: name
          }
        });
        if (checkupdatedLecturer) {
          response.status(404).send({
            status: 'error',
            message: `Lecturer with Surname: ${surname} and Name: ${name} already exists`
          });
        } else {
          const updateLecturer = await lecturer.save();
          if (!updateLecturer) {
            response.status(400).send({
              status: 'error',
              message: `Lecturer with Surname: ${current_surname} failed update`
            });
          }
        }
        response.status(200).send({
          status: 'success',
          message: `Lecturer with Surname: ${current_surname}`
        });

      }
    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { current_surname, current_name } = request.query;
      const lecturer = await Lecturer.findOne({
        where: {
          surname: current_surname,
          name: current_name
        }
      });

      if (!lecturer) {
        response.status(404).send({
          status: 'error',
          message: `Lecturer with Surname: ${current_surname} and Name: ${current_name} not found`
        });
      } else {
        await lecturer?.destroy();
        response.status(200).send({
          status: 'success',
          message: `Lecturer with Surname: ${current_surname} and Name: ${current_name} deleted`
        });

      }

    } catch (error) {
      next(error);
    }
  }

}

export default LecturerController;
