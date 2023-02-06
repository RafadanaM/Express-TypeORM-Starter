import { JwtPayload } from 'jsonwebtoken';

interface RequestPasswordResetTokenPayload {
  id: string;
}

interface RequestPasswordResetToken extends JwtPayload {
  id: string;
}

export { RequestPasswordResetToken, RequestPasswordResetTokenPayload };
