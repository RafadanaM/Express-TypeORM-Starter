import StatusCode from '../enums/statusCode.enum';
import HttpException from './http.exception';

class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.FORBIDDEN, message ?? 'Forbidden');
  }
}

export default ForbiddenException;
