import StatusCode from '../enums/statusCode.enum';
import HttpException from './http.exception';

class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.BAD_REQUEST, message ?? 'Bad Request');
  }
}

export default BadRequestException;
