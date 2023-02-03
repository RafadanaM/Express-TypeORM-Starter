import StatusCode from '../enums/statusCode.enum';
import HttpException from './http.exception';

class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.UNAUTHORIZED, message ?? 'Unauthorized');
  }
}

export default UnauthorizedException;
