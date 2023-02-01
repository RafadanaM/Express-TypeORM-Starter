import HttpException from './http.exception';

class invalidTokenException extends HttpException {
  constructor() {
    super(401, 'Invalid Token');
  }
}
export default invalidTokenException;
