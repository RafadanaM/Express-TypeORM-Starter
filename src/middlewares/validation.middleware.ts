import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import { RequestTypes } from 'src/enums/request.enum';
import HttpException from '../exceptions/http.exception';

function validationMiddleware(
  type: any,
  property: RequestTypes,
  skipMissingProperties: boolean = false
): express.RequestHandler {
  return (req, _, next) => {
    validate(plainToInstance(type, req[property]), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
