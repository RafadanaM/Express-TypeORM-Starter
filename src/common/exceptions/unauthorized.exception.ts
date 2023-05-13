import StatusCode from "../enums/statusCode.enum";
import HttpException from "./http.exception";

class UnauthorizedException extends HttpException {
  constructor(message?: string, error?: unknown | null) {
    super(StatusCode.UNAUTHORIZED, message ?? "Unauthorized", error);
  }
}

export default UnauthorizedException;
