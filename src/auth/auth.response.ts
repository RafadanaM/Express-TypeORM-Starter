import Users from '../users/users.entity';

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  user: Partial<Users>;
}
