import BaseRequest from "../../common/requests/base.request";
import { ResetPasswordDTO } from "../schemas/resetPassword.schema";

export default interface PasswordResetRequest extends BaseRequest<unknown, unknown, ResetPasswordDTO> {}
