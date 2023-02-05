import BaseRequest from '../../common/requests/base.request';

interface RequestPasswordResetBody {
  email: string;
}

interface RequestPasswordResetRequest extends BaseRequest<unknown, unknown, RequestPasswordResetBody> {}

export default RequestPasswordResetRequest;
