import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import { BaseResponse } from "../responses/base.response";
import BaseRequest from "../requests/base.request";
import { RequestTypes } from "../enums/request.enum";
import Constructor from "../types/Contructor.type";

const validationMiddleware = <T extends object>(
  type: Constructor<T>,
  property: RequestTypes,
  skipMissingProperties = false,
) => {
  return (req: BaseRequest, _res: BaseResponse, next: NextFunction) => {
    const prop = req[property];
    // I'm not sure of the generics
    validate(plainToInstance<T, typeof prop>(type, prop), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints || "")).join(", ");
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
