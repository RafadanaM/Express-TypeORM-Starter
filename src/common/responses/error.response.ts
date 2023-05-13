import { BaseResponse, BaseResponseBody } from "./base.response";

interface ErrorResponseBody extends BaseResponseBody {
  error: unknown | null;
}

interface ErrorResponse extends BaseResponse<ErrorResponseBody> {}

export default ErrorResponse;
