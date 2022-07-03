import HttpException from './http.exception';

class UserDoesNotExist extends HttpException {
  constructor(email: string) {
    super(404, `Cannot find user with email of: ${email}`);
  }
}

export default UserDoesNotExist;
