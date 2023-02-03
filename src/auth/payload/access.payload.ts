import { JwtPayload } from 'jsonwebtoken';

interface AccessTokenPayload {
  id: string;
}

interface AccessToken extends JwtPayload {
  id: string;
}

export { AccessTokenPayload, AccessToken };
