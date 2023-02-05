import jwt from 'jsonwebtoken';
import { TokenExpiration } from '../enums/token.enum';
import { CookieOptions } from 'express';
import { AccessToken, AccessTokenPayload } from '../../auth/payload/access.payload';
import { RefreshToken, RefreshTokenPayload } from '../../auth/payload/refresh.payload';
import { genSalt } from './hash.util';

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
 * @param {string} email payload of the token
 * @returns {string} JWT token
 */
export const signRequestPasswordResetToken = async (email: string): Promise<string> => {
  const salt = await genSalt();
  return jwt.sign(email, salt);
};
