import BaseRequest from "../../common/requests/base.request";
import { LoginDTO } from "../schemas/login.schema";

interface LoginRequest extends BaseRequest<unknown, unknown, LoginDTO> {}

export default LoginRequest;
