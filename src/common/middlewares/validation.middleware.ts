import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction } from 'express';

import { RequestTypes } from 'src/common/enums/request.enum';
import HttpException from '../exceptions/http.exception';
import { BaseResponse } from '../responses/base.response';
import BaseRequest from '../requests/base.request';

const validationMiddleware = <T>(type: ClassConstructor<T>, property: RequestTypes, skipMissingProperties = false) => {
  return (req: BaseRequest, _res: BaseResponse, next: NextFunction) => {
    validate(plainToInstance<T, RequestTypes>(type, req[property]), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      },
    );
  };
};

export default validationMiddleware;
{
}
