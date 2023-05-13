import { ZodError, ZodSchema } from "zod";

type ValidateRequestProp = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

type ValidateRequestArgs = ValidateRequestProp & {
  message?: string;
};

type ValidateRequestError = {
  key: keyof ValidateRequestProp;
  error: ZodError;
};

export { ValidateRequestProp, ValidateRequestArgs, ValidateRequestError };
