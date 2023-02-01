export interface AccessTokenPayload {
  email: string;
  first_name: string;
  last_name: string;
}

export interface RefreshTokenPayload {
  email: string
}

export interface AccessToken extends AccessTokenPayload {
  exp: number;
}

export interface RefreshToken extends RefreshTokenPayload {
  exp: number;
}