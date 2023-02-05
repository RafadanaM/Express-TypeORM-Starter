import { NextFunction } from 'express';
import { Cookies } from '../enums/token.enum';

import { verifyAccessToken } from '../utils/token.util';
import BaseRequest from '../requests/base.request';
import UserResponse from '../responses/auth.response';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import logger from '../logger/logger';

const authMiddleware = async (request: BaseRequest, response: UserResponse, next: NextFunction) => {
  const cookies = request.cookies;
  logger.debug(cookies);
  if (!cookies || !cookies[Cookies.ACCESS_TOKEN]) return next(new UnauthorizedException('Token is missing'));
  const verificationResponse = verifyAccessToken(cookies[Cookies.ACCESS_TOKEN]);
  if (verificationResponse === null) return next(new UnauthorizedException('Token is invalid'));
  //   https://stackoverflow.com/a/65144765

  response.locals.userId = verificationResponse.id;
  next();
};
export default authMiddleware;
