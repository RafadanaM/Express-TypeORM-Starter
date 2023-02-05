import jwt from 'jsonwebtoken';
import { TokenExpiration } from '../enums/token.enum';
import { CookieOptions } from 'express';
import { AccessToken, AccessTokenPayload } from '../../auth/payload/access.payload';
import { RefreshToken, RefreshTokenPayload } from '../../auth/payload/refresh.payload';

export const refreshCookieOption: CookieOptions = {
  httpOnly: true,
  // secure: true,
  path: '/api/auth',
  maxAge: TokenExpiration.REFRESH * 1000,
};

export const accessCookieOption: CookieOptions = {
  httpOnly: true,
  // secure: true,
  maxAge: TokenExpiration.ACCESS * 1000,
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const accessTokenSecret = process.env.access_token_private || '';

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: TokenExpiration.ACCESS,
    algorithm: 'RS256',
  });
};

export const verifyAccessToken = (token: string): AccessToken | null => {
  try {
    const accessTokenSecret = process.env.access_token_public || '';
    const decoded = jwt.verify(token, accessTokenSecret);
    return decoded as AccessToken;
  } catch (error) {
    return null;
  }
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const refreshTokenSecret = process.env.refresh_token_private || '';
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: TokenExpiration.REFRESH,
    algorithm: 'RS256',
  });
};

export const verifyRefreshToken = (token: string): RefreshToken | null => {
  try {
    const refreshTokenSecret = process.env.refresh_token_public || '';
    const decoded = jwt.verify(token, refreshTokenSecret);
    return decoded as RefreshToken;
  } catch (error) {
    return null;
  }
};
