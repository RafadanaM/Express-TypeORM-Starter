import { NextFunction } from "express";
import BaseRequest from "../requests/base.request";
import { BaseResponse } from "../responses/base.response";
import BadRequestException from "../exceptions/badRequest.exception";
import { ValidateRequestArgs, ValidateRequestError } from "../types/ValidateRequest.type";

const validateRequest =
  ({ body, params, query, message }: ValidateRequestArgs) =>
  (req: BaseRequest, _res: BaseResponse, next: NextFunction) => {
    const errors: ValidateRequestError[] = [];

    if (body) {
      const resultBody = body.safeParse(req.body);
      if (!resultBody.success) {
        errors.push({ key: "body", error: resultBody.error });
      }
    }

    if (params) {
      const resultParams = params.safeParse(req.params);
      if (!resultParams.success) {
        errors.push({ key: "params", error: resultParams.error });
      }
    }

    if (query) {
      const resultQuery = query.safeParse(req.query);
      if (!resultQuery.success) {
        errors.push({ key: "query", error: resultQuery.error });
      }
    }

    if (errors.length > 0) {
      // The codes in this statement is unreadable kekw
      // Honestly, I dont like this at all because the error object totally depends on zod instead of creating my own, but it's good enough
      const defaultError = errors.reduce((acc, curr) => {
        acc[curr.key.toString()] = curr.error.format();
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any);

      const defaultMessage =
        message ??
        errors.reduce(
          (acc, curr, idx) =>
            acc +
            `${idx === 0 ? "" : "."} Invalid ${curr.key} input of: ${curr.error.errors.reduce(
              (acc2, curr2, idx2) => acc2 + `${idx2 === 0 ? "" : ", "}${curr2.path.join("-")}`,
              "",
            )}`,

          "",
        );
      return next(new BadRequestException(defaultMessage, defaultError));
    } else {
      return next();
    }
  };

export default validateRequest;
