import StatusCode from "../enums/statusCode.enum";
import HttpException from "./http.exception";

class ForbiddenException extends HttpException {
  constructor(message?: string, error?: unknown | null) {
    super(StatusCode.FORBIDDEN, message ?? "Forbidden", error);
  }
}

export default ForbiddenException;
