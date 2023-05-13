import BaseRequest from "../../common/requests/base.request";
import { VerifyUserDTO } from "../schemas/verifyUser.schema";

interface VerifyUserRequest extends BaseRequest<unknown, unknown, VerifyUserDTO> {}
export default VerifyUserRequest;
