import Users from '../../users/entities/users.entity';

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  user: Partial<Users>;
}
