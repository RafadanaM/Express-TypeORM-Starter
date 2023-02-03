import StatusCode from '../enums/statusCode.enum';
import HttpException from './http.exception';

class InternalServerErrorException extends HttpException {
  constructor() {
    super(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}
export default InternalServerErrorException;
