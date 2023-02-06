import { Repository } from 'typeorm';
import AppDataSource from '../../db/data-source';
import Users from '../../users/entities/users.entity';
import {
  signAccessToken,
  signRefreshToken,
  signRequestToken,
  verifyRefreshToken,
  verifyRequestToken,
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
import ResetPasswordDTO from '../dto/resetPassword.dto';
import ResetPasswordRequestDTO from '../dto/resetPasswordRequest.dto';
import NotFoundException from '../../common/exceptions/notFound.exception';

class AuthService {
  usersRepository: Repository<Users>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(Users);
  }

  /**
   * generate request url for account verification and password reset
   * @param {"verify" | "password-reset"} type
   * @param {string} token token to set as search param
   * @param {string} userId userId to set as search param
   * @returns
   */
  private generateRequestURL(type: 'verify' | 'password-reset', token: string, userId: string): URL {
    const path = `/${type}`;

    const url = new URL(`https://localhost:3000${path}`);
    url.searchParams.set('token', token);
    url.searchParams.set('id', userId);

    return url;
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

  public async requestResetPassword(data: ResetPasswordRequestDTO): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.id'])
      .where('users.email = :email', { email: data.email })
      .getOne();

    if (user) {
      const { token, key } = await signRequestToken({ id: user.id });
      const baseKey = `${user.id}_password_`;
      await deleteScan(baseKey + '*');

      await redisClient.setEx(`${baseKey}${token}`, TokenExpiration.REQUEST, key);
      const url = this.generateRequestURL('password-reset', token, user.id);
      await sendRequestResetPasswordMail(user.email, url.toString());
    }
  }
  public async resetPassword(data: ResetPasswordDTO): Promise<string> {
    /*
    Check if token is in whitelist, if not in whitelist reject
    verify token received, reject if error
    check if user exist, reject if not
    hash the new password
    update the new password on db
    delete all refresh token of the user on the whitelist
    delete the user's request password reset token on whitelist
    */
    const { id, token, password } = data;

    const key = await redisClient.get(`${id}_password_${token}`);
    if (key === null)
      throw new UnauthorizedException('your link has expired, please request a new password reset link');

    const decoded = verifyRequestToken(token, key);

    if (decoded === null)
      throw new UnauthorizedException('your link is invalid, please request a new password reset link');

    const user = await this.usersRepository.createQueryBuilder('users').select(['users.id']).getOne();
    if (user === null) throw new NotFoundException('user not found');

    const hashed_password = await hashPassword(password);

    await this.usersRepository
      .createQueryBuilder('users')
      .update()
      .set({ password: hashed_password })
      .where('users.id = :id', { id: user.id })
      .execute();

    await deleteScan(`${user.id}_refresh_*`);
    await redisClient.del(`${user.id}_password_${token}`);

    return 'password has been succesfully changed';
  }

  public async requestVerification() {
    /*
    Check if user exists by email, reject if not found
    delete all verification request token for the user
    generate new verification token for the user
    add the token to the whitelist
    generate url for the user with params of userId and verify token
    send an email to the user with the url
    */
  }

  public async verifyUser() {
    /*
    check token in whitelist to get the token and key, reject if not found
    verify token, reject if error
    check if user exists, reject if not found
    change verification status of the user to verified
    remove the token from the whitelist
    */
  }
}
export default AuthService;
