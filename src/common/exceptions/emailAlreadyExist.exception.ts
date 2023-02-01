import HttpException from './http.exception';

class EmailAlreadyExist extends HttpException {
  constructor() {
    super(400, 'Email Already Exist!');
  }
}
export default EmailAlreadyExist;
