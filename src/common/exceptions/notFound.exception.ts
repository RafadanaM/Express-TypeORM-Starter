import StatusCode from '../enums/statusCode.enum';
import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.NOT_FOUND, message ?? 'Not Found');
  }
}

export default NotFoundException;
