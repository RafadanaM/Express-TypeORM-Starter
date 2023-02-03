import { BaseResponse, BaseResponseBody } from '../../common/responses/base.response';
import Users from '../../users/entities/users.entity';

interface LoginResponseBody extends BaseResponseBody {
  user: Partial<Users>;
}

interface LoginResponse extends BaseResponse<LoginResponseBody> {}

export { LoginResponse, LoginResponseBody };
