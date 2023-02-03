import { NextFunction } from 'express';
import BaseRequest from '../requests/base.request';
import NotFoundResponse from '../responses/notFound.response';
import StatusCode from '../enums/statusCode.enum';

const NotFoundMiddleware = async (req: BaseRequest, res: NotFoundResponse, _next: NextFunction) => {
  const statusCode = StatusCode.NOT_FOUND;
  const message = 'Route Not Found';
  const path: string = req.path;
  const method: string = req.method;

  return res.status(statusCode).send({ statusCode, message, path, method });
};

export default NotFoundMiddleware;
