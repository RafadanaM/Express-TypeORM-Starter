import BaseRequest from '../../common/requests/base.request';
import ResetPasswordRequestDTO from '../dto/resetPasswordRequest.dto';

interface RequestPasswordResetRequest extends BaseRequest<unknown, unknown, ResetPasswordRequestDTO> {}

export default RequestPasswordResetRequest;
