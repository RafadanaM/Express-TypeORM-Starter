import StatusCode from "../enums/statusCode.enum";
import HttpException from "./http.exception";

class BadRequestException extends HttpException {
  constructor(message?: string, error?: unknown | null) {
    super(StatusCode.BAD_REQUEST, message ?? "Bad Request", error);
  }
}

export default BadRequestException;
