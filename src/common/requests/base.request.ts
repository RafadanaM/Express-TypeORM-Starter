/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
interface ParamsDictionary {
  [key: string]: string;
}
interface BaseRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
export default BaseRequest;
