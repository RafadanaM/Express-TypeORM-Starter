import { NextFunction } from 'express';
import { Cookies } from '../enums/token.enum';
import invalidTokenException from '../exceptions/InvalidToken.exception';
import MissingTokenException from '../exceptions/missingToken.exception';

import { verifyAccessToken } from '../utils/token.util';
import BaseRequest from '../requests/base.request';
import UserResponse from '../responses/auth.response';

const authMiddleware = async (request: BaseRequest, response: UserResponse, next: NextFunction) => {
  const cookies = request.cookies;
  if (!cookies || !cookies[Cookies.ACCESS_TOKEN]) return next(new MissingTokenException());
  const verificationResponse = verifyAccessToken(cookies[Cookies.ACCESS_TOKEN]);
  if (verificationResponse === null) return next(new invalidTokenException());
  //   https://stackoverflow.com/a/65144765

  response.locals.userId = verificationResponse.id;
  next();
};
export default authMiddleware;
