import HttpException from '../exceptions/http.exception';
import { NextFunction } from 'express';
import BaseRequest from '../requests/base.request';
import { BaseResponse } from '../responses/base.response';
import StatusCode from '../enums/statusCode.enum';
import logger from '../logger/logger';

const errorMiddleware = async (error: Error, _request: BaseRequest, response: BaseResponse, _next: NextFunction) => {
  let statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  logger.debug(error);
  if (error instanceof HttpException) {
    statusCode = error.status || StatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    return response.status(statusCode).send({ statusCode, message });
  }
  return response.status(statusCode).send({ statusCode: statusCode, message: 'Internal Server Error' });
};

export default errorMiddleware;
