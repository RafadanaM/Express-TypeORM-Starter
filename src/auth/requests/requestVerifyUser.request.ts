import BaseRequest from "../../common/requests/base.request";
import { RequestVerifyUserDTO } from "../schemas/requestVerifyUser.schema";

interface RequestVerifyUserRequest extends BaseRequest<unknown, RequestVerifyUserDTO> {}
export default RequestVerifyUserRequest;
