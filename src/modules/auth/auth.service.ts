import { Repository } from 'typeorm';
import AppDataSource from '../../data-source';
import EmailAlreadyExist from '../../exceptions/emailAlreadyExist.exception';
import HttpException from '../../exceptions/http.exception';
import Users from '../users/users.entity';
import bcrypt from 'bcrypt';
import { loginDTO, registerDTO } from './auth.dto';
import EmailPasswordDoesNotMatch from '../../exceptions/emailPasswordDoesNotMatch.exception';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/token.util';
import MissingTokenException from '../../exceptions/missingToken.exception';
import invalidTokenException from '../../exceptions/InvalidToken.exception';
import { isQueryFailedError } from '../../utils/db.util';

class AuthService {
  private userRepository: Repository<Users>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(Users);
  }

  public register = async (userData: registerDTO): Promise<Users> => {
    try {
      const hashed_password = await bcrypt.hash(userData.password, 11);
      const newUser = this.userRepository.create({ ...userData, password: hashed_password });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (isQueryFailedError(error)) {
        if (error.code === '23505') {
          throw new EmailAlreadyExist();
        }
      }
      throw new HttpException(500, 'Something went wrong');
    }
  };

  public login = async (loginData: loginDTO, oldToken: string | undefined) => {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.first_name', 'users.last_name', 'users.password', 'users.refresh_tokens'])
      .where('users.email = :email', { email: loginData.email })
      .getOne();
    if (!user) throw new EmailPasswordDoesNotMatch();

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) throw new EmailPasswordDoesNotMatch();

    const accessToken = signAccessToken({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
    const refreshToken = signRefreshToken({ email: user.email });

    // If there's an old token in cookie when loggin in, then remove that token from list
    const newRefreshTokens =
      oldToken === undefined ? user.refresh_tokens : user.refresh_tokens.filter((rt) => rt !== oldToken);

    await this.userRepository
      .createQueryBuilder('users')
      .update()
      .set({ refresh_tokens: [...newRefreshTokens, refreshToken] })
      .where('users.email = :email', { email: user.email })
      .execute();

    return { accessToken, refreshToken };
  };

  public logout = async (token: string) => {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.refresh_tokens'])
      .where(':token = ANY (users.refresh_tokens)', { token: token })
      .getOne();

    if (user) {
      const filteredRefreshTokens = user.refresh_tokens.filter((rt) => rt !== token);
      await this.userRepository
        .createQueryBuilder('users')
        .update()
        .set({ refresh_tokens: [...filteredRefreshTokens] })
        .where('users.email = :email', { email: user.email })
        .execute();
    }
    return;
  };

  public refreshHandler = async (token: string | undefined) => {
    if (token === undefined) throw new MissingTokenException();

    const refreshTokenResponse = verifyRefreshToken(token);
    // if token is invalid/expires
    if (refreshTokenResponse === null) {
      const mUser = await this.userRepository
        .createQueryBuilder('users')
        .select(['users.email , users.refresh_tokens'])
        .where(':token = ANY (users.refresh_tokens)', { token: token })
        .getOne();

      // if user with the expired/invalid token exist, then remove the token
      if (mUser) {
        await this.userRepository
          .createQueryBuilder('users')
          .update()
          .set({ refresh_tokens: [...mUser.refresh_tokens.filter((rt) => rt !== token)] })
          .where('users.email = :email', { email: mUser.email })
          .execute();
      }
      throw new invalidTokenException();
    }
    // Token is valid
    const user = await this.userRepository
      .createQueryBuilder('users')
      .select(['users.email', 'users.first_name', 'users.last_name', 'users.refresh_tokens'])
      .where('users.email = :email', { email: refreshTokenResponse.email })
      .getOne();
    if (!user) throw new invalidTokenException();

    // if token does not exists on a users refresh_token
    const userRefreshTokenIndex = user.refresh_tokens.indexOf(token);
    if (userRefreshTokenIndex === -1) {
      // Then it is token re-use, empty the users refresh_token
      user.refresh_tokens = [];
      await this.userRepository
        .createQueryBuilder('users')
        .update()
        .set({ refresh_tokens: [] })
        .where('users.email = :email', { email: user.email })
        .execute();
      throw new invalidTokenException();
    }

    // Token does exists on users refresh token, remove the token
    // and add a new refresh token to the list

    const refreshToken = signRefreshToken({ email: user.email });
    const accessToken = signAccessToken({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    await this.userRepository
      .createQueryBuilder('users')
      .update()
      .set({ refresh_tokens: [...user.refresh_tokens.filter((x) => x !== token), refreshToken] })
      .where('users.email = :email', { email: user.email })
      .execute();
    return { accessToken, refreshToken };
  };
}
export default AuthService;
