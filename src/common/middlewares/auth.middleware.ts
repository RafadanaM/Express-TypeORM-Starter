import { NextFunction, Request, Response } from 'express';
import { Cookies } from '../enums/token.enum';
import invalidTokenException from '../exceptions/InvalidToken.exception';
import MissingTokenException from '../exceptions/missingToken.exception';
import AuthResponseLocals from '../interfaces/authResponseLocal.interface';
import { verifyAccessToken } from '../utils/token.util';

const authMiddleware = async (
  request: Request,
  response: Response<Record<string, never>, AuthResponseLocals>,
  next: NextFunction,
) => {
  const cookies = request.cookies;
  if (!cookies || !cookies[Cookies.ACCESS_TOKEN]) return next(new MissingTokenException());
  const verificationResponse = verifyAccessToken(cookies[Cookies.ACCESS_TOKEN]);
  if (verificationResponse === null) return next(new invalidTokenException());
  //   https://stackoverflow.com/a/65144765
  response.locals.user_email = verificationResponse.email;
  next();
};
export default authMiddleware;
