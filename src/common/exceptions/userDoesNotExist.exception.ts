import HttpException from './http.exception';

class UserDoesNotExist extends HttpException {
  constructor() {
    super(404, `Cannot find user`);
  }
}

export default UserDoesNotExist;
