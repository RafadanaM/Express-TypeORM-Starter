import { JwtPayload } from 'jsonwebtoken';

interface RequestTokenPayload {
  id: string;
}

interface RequestToken extends JwtPayload {
  id: string;
}

export { RequestToken, RequestTokenPayload };
