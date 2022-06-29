import HttpException from './http.exception';

class MissingTokenException extends HttpException {
  constructor() {
    super(401, 'Missing Token');
  }
}
export default MissingTokenException;
