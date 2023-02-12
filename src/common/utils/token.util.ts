import jwt from 'jsonwebtoken';
import { TokenExpiration } from '../enums/token.enum';
import { CookieOptions } from 'express';
import { AccessToken, AccessTokenPayload } from '../../auth/payload/access.payload';
import { RefreshToken, RefreshTokenPayload } from '../../auth/payload/refresh.payload';
import { genSalt } from './hash.util';
import { RequestToken, RequestTokenPayload } from '../../auth/payload/requestPasswordReset.payload';

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

/**
 * Create JWT access token
 * @param {AccessTokenPayload} payload payload of the access token
 * @returns {string} JWT access token
 */
export const signAccessToken = (payload: AccessTokenPayload): string => {
  const accessTokenSecret = process.env.access_token_private || '';

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: TokenExpiration.ACCESS,
    algorithm: 'RS256',
  });
};

/**
 * Verify JWT access token, returns the decoded token, returns null if an error
 * @param {string} token JWT access token
 * @returns {AccessToken | null} verification result
 */
export const verifyAccessToken = (token: string): AccessToken | null => {
  try {
    const accessTokenSecret = process.env.access_token_public || '';
    const decoded = jwt.verify(token, accessTokenSecret);
    return decoded as AccessToken;
  } catch (error) {
    return null;
  }
};

/**
 * Create JWT refresh token
 * @param {RefreshTokenPayload} payload payload of the refresh token
 * @returns {string} JWT refresh token
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const refreshTokenSecret = process.env.refresh_token_private || '';
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: TokenExpiration.REFRESH,
    algorithm: 'RS256',
  });
};

/**
 * Verify JWT refresh token, returns the decoded token, returns null if an error
 * @param {string} token JWT refresh token
 * @returns  {RefreshToken | null} verification result
 */
export const verifyRefreshToken = (token: string): RefreshToken | null => {
  try {
    const refreshTokenSecret = process.env.refresh_token_public || '';
    const decoded = jwt.verify(token, refreshTokenSecret);
    return decoded as RefreshToken;
  } catch (error) {
    return null;
  }
};

/**
 * Create JWT token for password reset
 * @param {RequestTokenPayload} payload payload of the token
 * @returns  JWT token and salt pai
 */
export const signRequestToken = async (payload: RequestTokenPayload, expiresIn: number) => {
  const key = await genSalt();
  const token = jwt.sign(payload, key, {
    expiresIn: expiresIn,
  });
  return { token, key };
};

/**
 * Verify token for password reset
 * @param {string} token password reset token
 * @param {string} key key used to verify the token
 * @returns decoded token
 */
export const verifyRequestToken = (token: string, key: string): RequestToken | null => {
  try {
    const decoded = jwt.verify(token, key);
    return decoded as RequestToken;
  } catch (error) {
    return null;
  }
};
