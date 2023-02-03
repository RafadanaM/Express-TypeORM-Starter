import { BaseResponse, BaseResponseBody } from '../../common/responses/base.response';
import Users from '../entities/users.entity';

interface UsersResponseBody extends BaseResponseBody {
  users: Partial<Users>[];
}

interface UsersResponse extends BaseResponse<UsersResponseBody> {}

export { UsersResponse };
