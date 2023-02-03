import HttpException from '../exceptions/http.exception';
import { NextFunction } from 'express';
import BaseRequest from '../requests/base.request';
import { BaseResponse } from '../responses/base.response';

const errorMiddleware = async (error: Error, _request: BaseRequest, response: BaseResponse, _next: NextFunction) => {
  if (error instanceof HttpException) {
    const status: number = error.status || 500;
    const message = error.message || 'Internal Server Error';
    return response.status(status).send({ statusCode: status, message });
  }
  return response.status(500).send({ statusCode: 500, message: 'Internal Server Error' });
};

export default errorMiddleware;
