import { BaseResponse } from './base.response';

interface UserLocals {
  userId: string;
}

interface AuthResponse<ResBody = unknown> extends BaseResponse<ResBody, UserLocals> {}
export default AuthResponse;
