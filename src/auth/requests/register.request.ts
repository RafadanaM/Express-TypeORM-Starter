import BaseRequest from "../../common/requests/base.request";
import { RegisterDTO } from "../schemas/register.schema";

interface RegisterRequest extends BaseRequest<unknown, unknown, RegisterDTO> {}

export default RegisterRequest;
