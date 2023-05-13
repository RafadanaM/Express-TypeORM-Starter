/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

interface BaseResponseBody {
  statusCode: number;
  message: string;
}

interface BaseResponse<ResBody = BaseResponseBody, Locals extends Record<string, any> = Record<string, any>>
  extends Response<ResBody, Locals> {}

export { BaseResponseBody, BaseResponse };
