import { AccessToken, AccessTokenPayload, RefreshTokenPayload } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import { TokenExpiration } from '../enums/token.enum';
import { CookieOptions } from 'express';

export const refreshCookieOption: CookieOptions = {
  httpOnly: true,
  // secure: true,
  // sameSite: 'none',
  maxAge: TokenExpiration.Refresh * 1000,
};

export const signAccessToken = (payload: AccessTokenPayload) => {
  const accessTokenSecret = process.env.access_token_private;

  return jwt.sign(payload, accessTokenSecret!, {
    expiresIn: TokenExpiration.Access,
    algorithm: 'RS256',
  });
};

export const verifyAccessToken = (token: string): AccessToken | null => {
  try {
    const accessTokenSecret = process.env.access_token_public;
    const decoded = jwt.verify(token, accessTokenSecret!);
    return decoded as AccessToken;
  } catch (error) {
    return null;
  }
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  const refreshTokenSecret = process.env.refresh_token_private;
  return jwt.sign(payload, refreshTokenSecret!, {
    expiresIn: TokenExpiration.Refresh,
    algorithm: 'RS256',
  });
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const refreshTokenSecret = process.env.refresh_token_public;
    const decoded = jwt.verify(token, refreshTokenSecret!);
    return decoded as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
};
