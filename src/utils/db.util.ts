import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';

// src: https://github.com/typeorm/typeorm/issues/5057#issuecomment-734442426
export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
  err instanceof QueryFailedError;
