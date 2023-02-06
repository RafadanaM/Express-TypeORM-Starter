import BaseRequest from '../../common/requests/base.request';
import ResetPasswordDTO from '../dto/resetPassword.dto';

export default interface PasswordResetRequest extends BaseRequest<unknown, unknown, ResetPasswordDTO> {}
