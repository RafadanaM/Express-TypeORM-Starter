import BaseRequest from "../../common/requests/base.request";
import { ResetPasswordRequestDTO } from "../schemas/resetPasswordRequest.schema";

interface RequestPasswordResetRequest extends BaseRequest<unknown, unknown, ResetPasswordRequestDTO> {}

export default RequestPasswordResetRequest;
