import { JwtPayload } from 'jsonwebtoken';

interface RefreshTokenPayload {
  id: string;
}

interface RefreshToken extends JwtPayload {
  id: string;
}

export { RefreshTokenPayload, RefreshToken };
