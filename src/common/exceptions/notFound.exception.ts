import StatusCode from "../enums/statusCode.enum";
import HttpException from "./http.exception";

class NotFoundException extends HttpException {
  constructor(message?: string, error?: unknown | null) {
    super(StatusCode.NOT_FOUND, message ?? "Not Found", error);
  }
}

export default NotFoundException;
