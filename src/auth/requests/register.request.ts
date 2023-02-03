import RegisterDTO from '../dto/register.dto';
import BaseRequest from '../../common/requests/base.request';

interface RegisterRequest extends BaseRequest<unknown, unknown, RegisterDTO> {}

export default RegisterRequest;
