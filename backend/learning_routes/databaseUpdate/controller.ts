import { DegreeProgramme } from "../../database/models"
import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { getCouresFromGivenDegree } from '../../api/courses/index'
const model_url = "http://localhost:8080";

async function request(object: any, apiRoute: string) {
    const url = model_url + apiRoute;
    for (const element of object) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(element)
        }); const { data, errors } = await response.json()
        console.log(data);
        console.log(errors);
    }
}
const databaseUpdateController = {
    async updateDatabase(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const degree_programmes = await DegreeProgramme.findAll();
            makeRequests(degree_programmes)
            .then(() => response.status(200).send("Data updated successfully"))
        } catch (error) {
            next(error);

        }
    }
}
async function makeRequests(degree_programmes: string | any[]) {
    let promises = [];
    for (let i = 0; i < 24; i++) {
        promises.push(getCouresFromGivenDegree(degree_programmes[i].name, degree_programmes[i].splan_id).then(async x => {
            await request(x[0], "/api/course")
            await request(x[1], "/api/lecturer")
            await request(x[2], "/api/lecture")
        }));
    }
    return Promise.all(promises);
}
export default databaseUpdateController