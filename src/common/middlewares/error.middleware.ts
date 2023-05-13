import HttpException from "../exceptions/http.exception";
import { NextFunction } from "express";
import BaseRequest from "../requests/base.request";
import StatusCode from "../enums/statusCode.enum";
import logger from "../logger/logger";
import ErrorResponse from "../responses/error.response";

const errorMiddleware = async (error: Error, _request: BaseRequest, response: ErrorResponse, _next: NextFunction) => {
  let statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  logger.debug(error);
  if (error instanceof HttpException) {
    statusCode = error.status || StatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    return response.status(statusCode).send({ statusCode, message, error: error.error });
  }
  return response.status(statusCode).send({ statusCode: statusCode, message: "Internal Server Error", error: null });
};

export default errorMiddleware;
