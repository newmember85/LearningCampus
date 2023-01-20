import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';

const validate = (validations: ValidationChain[]) => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(request)));

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    }

    response.status(400).json({ errors: errors.array() });
  };
};

export default validate;