import Users from '../../users/entities/users.entity';

interface LoginServiceResponse {
  refreshToken: string;
  accessToken: string;

  userResponse: Pick<Users, 'email' | 'first_name' | 'last_name'>;
}

export default LoginServiceResponse;
