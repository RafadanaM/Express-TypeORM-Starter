import { Repository } from 'typeorm';
import AppDataSource from '../../db/data-source';
import Users from '../../users/entities/users.entity';
import {
  signAccessToken,
  signRefreshToken,
  signRequestPasswordResetToken,
  verifyRefreshToken,
} from '../../common/utils/token.util';
import { isQueryFailedError } from '../../common/utils/db.util';
import { comparePassword, hashPassword } from '../../common/utils/hash.util';
import RegisterDTO from '../dto/register.dto';
import LoginDTO from '../dto/login.dto';
import BadRequestException from '../../common/exceptions/badRequest.exception';
import InternalServerErrorException from '../../common/exceptions/internalServerError.exception';
import UnauthorizedException from '../../common/exceptions/unauthorized.exception';
import redisClient from '../../common/config/redis';
import { TokenExpiration } from '../../common/enums/token.enum';
import LoginServiceResponse from '../responses/loginService.response';
import RefreshServiceResponse from '../responses/refreshService.response';
import { sendRequestResetPasswordMail } from '../../common/utils/mail.util';
import { deleteScan } from '../../common/utils/redis.util';

class AuthService {
  usersRepository: Repository<Users>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(Users);
  }

  public async register(registerData: RegisterDTO): Promise<string> {
    try {
      const hashed_password = await hashPassword(registerData.password);
      const newUser = this.usersRepository.create({ ...registerData, password: hashed_password });
      await this.usersRepository.save(newUser);
      const message = 'User created!';
      return message;
    } catch (error) {
      if (isQueryFailedError(error)) {
        if (error.code === '23505') {
          throw new BadRequestException('Email already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  public async login(loginData: LoginDTO, mRefreshToken: string | undefined): Promise<LoginServiceResponse> {
    if (mRefreshToken) {
      const decoded = verifyRefreshToken(mRefreshToken);
      if (decoded) throw new UnauthorizedException('You already logged in');
    }

    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.id', 'users.password', 'users.first_name', 'users.last_name'])
      .where('users.email = :email', { email: loginData.email })
      .getOne();

    if (!user) throw new BadRequestException('Email or Password does not match');

    const isMatch = await comparePassword(loginData.password, user.password);
    if (!isMatch) throw new BadRequestException('Email or Password does not match');

    const accessToken = signAccessToken({
      id: user.id,
    });
    const refreshToken = signRefreshToken({ id: user.id });

    const userResponse = user.select('email', 'first_name', 'last_name');

    await redisClient.setEx(`${user.id}_refresh_${refreshToken}`, TokenExpiration.REFRESH, refreshToken);

    return { accessToken, refreshToken, userResponse };
  }

  public async logout(refresh_token: string): Promise<void> {
    /*
    1. Remove refresh token from redis 
    2. clear the user's cookie
    */

    const tokenData = verifyRefreshToken(refresh_token);
    if (tokenData) {
      await redisClient.del(`${tokenData.id}_refresh_${refresh_token}`);
    }

    return;
  }

  public async refresh(token: string | undefined): Promise<RefreshServiceResponse> {
    /*
    Use Redis Whitelist (Honestly if not sure if I should use blacklist or whitelist)
    1. verify current refresh token, reject if invalid, otherwise continue
    2. check current refresh token from redis, if it exist remove it then continue
    3. generate new access & refresh token
    4. add newly created refresh token to redis with format {ID}_Refresh_{Token}
    5. return to user
    */

    if (token === undefined) throw new UnauthorizedException('Token is missing');

    const refreshTokenResponse = verifyRefreshToken(token);

    if (refreshTokenResponse === null) throw new UnauthorizedException('Invalid Token');

    await redisClient.del(`${refreshTokenResponse.id}_refresh_${token}`);

    const refreshToken = signRefreshToken({ id: refreshTokenResponse.id });
    const accessToken = signAccessToken({
      id: refreshTokenResponse.id,
    });

    await redisClient.setEx(
      `${refreshTokenResponse.id}_refresh_${refreshToken}`,
      TokenExpiration.REFRESH,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  public async requestResetPassword(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.id'])
      .where('users.email = :email', { email })
      .getOne();

    if (user) {
      const token = await signRequestPasswordResetToken(user.email);
      const baseKey = `${user.id}_password_`;
      await deleteScan(baseKey + '*');
      await redisClient.setEx(`${baseKey}_${token}`, TokenExpiration.PASSWORD_RESET, token);
      const url = `http://localhost:3000/password-reset?token=${token}`;
      await sendRequestResetPasswordMail(user.email, url);
    }
  }
}
export default AuthService;
