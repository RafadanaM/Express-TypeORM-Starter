import { Request, Response, NextFunction } from 'express';

const NotFoundMiddleware = async (req: Request, res: Response, _next: NextFunction) => {
  const status = 404;
  const message = 'Route Not Found';
  const path: string = req.path;
  const method: string = req.method;

  return res.status(status).send({ status, message, path, method });
};

export default NotFoundMiddleware;
