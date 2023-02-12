import BaseRequest from '../../common/requests/base.request';
import RequestVerifyUserDTO from '../dto/requestVerifyUser.dto';

interface RequestVerifyUserRequest extends BaseRequest<unknown, RequestVerifyUserDTO> {}
export default RequestVerifyUserRequest;
