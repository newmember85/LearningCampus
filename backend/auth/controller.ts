import { Request, Response } from 'express';
import { Lecturer, Student } from '../database/models';
import authModel from './model';
import bcrypt from 'bcryptjs'

const refreshTokens: string[] = [];


const authController = {
    async login(request: Request, response: Response): Promise<void> {

        const { username, password } = request.body;

        if (username === null) {
            response.status(400).send({
                status: 'Error',
                message: "Missing Username"
            });
        }
        const student = await Student.findOne({ where: { username: username } });
        const lecturer = await Lecturer.findOne({ where: { username: username } });

        if (!student && !lecturer)
            response.status(400).send({
                status: 'Error',
                message: "No User found!"
            });

        try {
            let obj_password = ""
            let obj_id = 0
            if (student) {
                obj_password = student?.password
                obj_id = student?.matrikel_nr
            } else {
                obj_password = lecturer?.password
                obj_id = lecturer?.id
            }

            if (await bcrypt.compare(password, obj_password)) {

                const ywtAuth = authModel.login(obj_id, username);
                refreshTokens.push(ywtAuth.refreshToken);

                if (ywtAuth.token) {
                    response.status(200).send(ywtAuth);
                } else {
                    response.statusCode = 400;
                    response.send('Bad Request');
                }
            } else {
                response.status(403).send({
                    status: 'success',
                    message: "Username or password does not match!"
                })
            }
        } catch {
            response.status(500).send()
        }
    },
    async token(request: Request, response: Response): Promise<void> {
        const refreshToken = request.body.token


        if (refreshToken == null) {
            response.sendStatus(401)
        }
        if (!refreshTokens.includes(refreshToken)) {
            response.sendStatus(403)
        } else {
            const accessToken = authModel.token(refreshToken);
            response.json({ token: accessToken });
        }
    }
};

export default authController;