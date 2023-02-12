import BaseRequest from '../../common/requests/base.request';
import VerifyUserDTO from '../dto/verifyUser.dto';

interface VerifyUserRequest extends BaseRequest<unknown, unknown, VerifyUserDTO> {}
export default VerifyUserRequest;
