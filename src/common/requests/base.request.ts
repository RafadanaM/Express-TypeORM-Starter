/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

interface BaseRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
export default BaseRequest;
