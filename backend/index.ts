import express from 'express';
import cors from 'cors';
import authRouter from './auth';
import db from './database/init';
import { port } from './constants';
import router from './learning_routes';
import wss from './web-socket-server';

const app = express();


db().then(() => console.log('Database is ready'));

app.use(express.json());
app.use(cors());

app.use('/help', async (Request, Response) => {
    Response.status(200).send({ message: `Welcome to the Learning Campus API!` })
})

app.use('/auth', authRouter);
app.use('/api/', router)

const start = () => {
    try {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    } catch (error: any) {
        console.log(`Error occurred: ${error.message}`)
    }
}

const temp = wss;

start();