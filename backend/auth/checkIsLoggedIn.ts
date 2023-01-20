import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../constants';

function checkIsLoggedIn(request: Request, response: Response, next: NextFunction): void {
  const token = request.headers.authorization?.split(' ')[1];
  let isValid = false;

  try {
    if (typeof token === 'string') {
      let decoded = jwt.verify(token, secret);
      isValid = !!decoded;
    }
  }
  catch (error) {
    console.error(error);
  }
  if (isValid) {
    next();
  } else {
    response.statusCode = 401;
    response.send('Unauthorized');
  }
}

function checkLecturerRole(request: Request, response: Response, next: NextFunction): void {
  const token = request.headers.authorization?.split(' ')[1];
  let isValid = false;

  try {
    if (typeof token === 'string') {
      let decoded = jwt.verify(token, secret);
      isValid = !!decoded;
    }
  }
  catch (error) {
    console.error(error);
  }
  if (isValid) {
    if (typeof token === 'string') {
      const user = jwt.verify(token, secret);
      const tes = Object.keys(user).some(l => l === "id")
      if (!Object.keys(user).some(k => k === "id")) {
        response.statusCode = 503;
        response.send('Forbidden');
      } else {
        next();
      }
    }
  } else {
    response.statusCode = 401;
    response.send('Unauthorized');
  }
}
export { checkIsLoggedIn, checkLecturerRole }
