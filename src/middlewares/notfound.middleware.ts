import { Request, Response, NextFunction } from 'express';

function NotFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const status: number = 404;
  const message: string = 'Route Not Found';
  const path: string = req.path;
  const method: string = req.method;

  return res.status(status).send({ status, message, path, method });
}

export default NotFoundMiddleware;
