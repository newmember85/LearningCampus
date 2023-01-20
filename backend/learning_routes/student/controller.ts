import { Request, Response, NextFunction } from 'express';
import { DegreeProgramme } from '../../database/models';
import Student from '../../database/models/student';
import returnUser from '../checkUser';
const StudentController = {


  async getStudent(request: Request, response: Response): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    response.json(student);
  },
  async getStudents(request: Request, response: Response): Promise<void> {
    const students = await Student.findAll();
    response.json(students);
  },
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { matrikel_nr, surname, name, username, password, degree_name } = request.body;
      const student = await Student.findAll({
        where: {
          matrikel_nr: matrikel_nr,
          username: username
        }
      });
      const degree_model = await DegreeProgramme.findOne({
        where: {
          name: degree_name
        }
      });
      if (student.length > 0) {
        response.status(409).send('Matrikel_nr or Username already exists')
      }
      else if (!degree_model) {
        response.status(404).send(`Degree: ${degree_name} not found`)
      } else {
        await Student.create({
          matrikel_nr: matrikel_nr,
          surname: surname,
          name: name,
          username: username,
          password: password,
          degree_id: degree_model?.id
        })
        response.status(201).send({
          status: 'success',
          message: 'Student was created'
        });
      }
    } catch (error) {
      next(error);
    }
  },
  async roleRequestStudent(request: Request, response: Response, next: NextFunction): Promise<void> {
    const user = returnUser(request);
    const student = await Student.findOne({ where: { matrikel_nr: user.id } })
    if (student) {
      response.json("true");
    } else {
      response.json("false")
    }
  },


  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { matrikel_nr } = request.params;

      const { surname, name, username, password } = request.body;

      const student = await Student.findOne({ where: { matrikel_nr: matrikel_nr } });

      if (!student) {
        response.status(404).send({
          status: 'error',
          message: `Person with id ${matrikel_nr} not found`
        });
      } else {
        if (surname) student.surname = surname;
        if (name) student.name = name;
        if (username) student.username = username;
        if (password) student.password = password;
        const updateStudent = await student.save();
        if (!updateStudent) {
          response.status(400).send({
            status: 'error',
            message: `data person with id ${matrikel_nr} failed update`
          });
        }
        response.status(200).send({
          status: 'success',
          message: `student with matrikel_nr: ${matrikel_nr}`
        });

      }
    } catch (error) {
      next(error);
    }

  },
  async destroy(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { matrikel_nr } = request.params;
      const student = await Student.findOne({ where: { matrikel_nr: matrikel_nr } });

      if (!student) {
        response.status(404).send({
          status: 'error',
          message: `Student with matrikel_Nr ${matrikel_nr} not found`
        });
      }
      const deleteStudent = await student?.destroy();
      if (!deleteStudent) {
        response.status(503).send({
          status: 'error',
          message: `Student with matrikel_Nr ${matrikel_nr} failed delete`
        });
      } else {
        response.status(200).send({
          status: 'success',
          message: `Student with matrikel_Nr ${matrikel_nr} deleted`
        });
      }
    } catch (error) {
      next(error);
    }
  }

}

export default StudentController;
