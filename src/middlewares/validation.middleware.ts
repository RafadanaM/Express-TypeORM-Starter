import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { RequestTypes } from 'src/enums/request.enum';
import HttpException from '../exceptions/http.exception';

const validationMiddleware = async (type: any, property: RequestTypes, skipMissingProperties: boolean = false) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req[property]), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
