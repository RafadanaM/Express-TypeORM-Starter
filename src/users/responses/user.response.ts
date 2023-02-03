import AuthResponse from '../../common/responses/auth.response';
import { BaseResponseBody } from '../../common/responses/base.response';
import Users from '../entities/users.entity';

interface UserResponseBody extends BaseResponseBody {
  user: Partial<Users>;
}

interface UserResponse extends AuthResponse<UserResponseBody> {}

export default UserResponse;
