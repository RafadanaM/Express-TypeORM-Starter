export interface RegisterResponse {
  first_name: string;
  last_name: string;
  email: string;
  birth_date: Date;
}

export interface AccessTokenResponse {
  accessToken: string;
}
