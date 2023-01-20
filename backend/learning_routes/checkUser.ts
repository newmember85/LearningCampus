import { Request } from 'express';

export default function returnUser(request: Request) {
    const token = request.headers.authorization?.split(' ')[1];
    let username;
    if (typeof token === 'string') {
        return username = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }
}