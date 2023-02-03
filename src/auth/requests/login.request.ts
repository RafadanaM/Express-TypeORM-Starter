import LoginDTO from '../dto/login.dto';
import BaseRequest from '../../common/requests/base.request';

interface LoginRequest extends BaseRequest<unknown, unknown, LoginDTO> {}

export default LoginRequest;
