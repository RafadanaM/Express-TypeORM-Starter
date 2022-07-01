import HttpException from '../exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = async (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof HttpException) {
    const status: number = error.status || 500;
    const message = error.message || 'something went wrong';
    return response.status(status).send({ status, message });
  }
  return response.status(500).send({ message: 'Internal Server Error' });
}

export default errorMiddleware;
