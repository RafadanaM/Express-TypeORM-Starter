import { BaseResponse, BaseResponseBody } from "../../common/responses/base.response";

interface IsAuthenticatedResponseBody extends BaseResponseBody {
  isAuthenticated: boolean;
}

interface IsAuthenticatedResponse extends BaseResponse<IsAuthenticatedResponseBody> {}

export { IsAuthenticatedResponse, IsAuthenticatedResponseBody };
