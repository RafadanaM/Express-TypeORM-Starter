import { NextFunction, Request, Response } from 'express';
import invalidTokenException from '../exceptions/InvalidToken.exception';
import MissingTokenException from '../exceptions/missingToken.exception';
import { verifyAccessToken } from '../utils/token.util';

interface AuthResponseLocals {
  user: string;
}

async function authMiddleware(request: Request, response: Response<{}, AuthResponseLocals>, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new MissingTokenException());
  const token = authHeader.split('Bearer ')[1];
  const verificationResponse = verifyAccessToken(token);
  if (verificationResponse === null) return next(new invalidTokenException());
  //   https://stackoverflow.com/a/65144765
  response.locals.user = verificationResponse.email;
  next();
}
export default authMiddleware;
