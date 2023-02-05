import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';

// src: https://github.com/typeorm/typeorm/issues/5057#issuecomment-734442426
/**
 * Check whether an error is TypeORM query error
 * @param {unknown} err Error
 * @returns {boolean}
 */
export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
  err instanceof QueryFailedError;
