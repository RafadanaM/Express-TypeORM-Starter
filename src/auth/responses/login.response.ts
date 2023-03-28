import { BaseResponse, BaseResponseBody } from "../../common/responses/base.response";
import Users from "../../users/entities/users.entity";

type LoginUser = Pick<Users, "email" | "first_name" | "last_name">;

interface LoginServiceResponse {
  refreshToken: string;
  accessToken: string;

  userResponse: LoginUser;
}

interface LoginResponseBody extends BaseResponseBody {
  user: LoginUser;
}

interface LoginResponse extends BaseResponse<LoginResponseBody> {}

export { LoginResponse, LoginResponseBody, LoginServiceResponse };
