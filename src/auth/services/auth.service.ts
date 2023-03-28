import { Repository } from "typeorm";
import AppDataSource from "../../../db/data-source";
import Users from "../../users/entities/users.entity";
import {
  signAccessToken,
  signRefreshToken,
  signRequestToken,
  verifyRefreshToken,
  verifyRequestToken,
} from "../../common/utils/token.util";
import { isQueryFailedError } from "../../common/utils/db.util";
import { comparePassword, hashPassword } from "../../common/utils/hash.util";
import RegisterDTO from "../dto/register.dto";
import LoginDTO from "../dto/login.dto";
import BadRequestException from "../../common/exceptions/badRequest.exception";
import InternalServerErrorException from "../../common/exceptions/internalServerError.exception";
import UnauthorizedException from "../../common/exceptions/unauthorized.exception";
import redisClient from "../../common/config/redis";
import { TokenExpiration } from "../../common/enums/token.enum";
import { sendRequestResetPasswordMail, sendVerificationMail } from "../../common/utils/mail.util";
import { deleteScan } from "../../common/utils/redis.util";
import ResetPasswordDTO from "../dto/resetPassword.dto";
import ResetPasswordRequestDTO from "../dto/resetPasswordRequest.dto";
import NotFoundException from "../../common/exceptions/notFound.exception";
import VerifyUserDTO from "../dto/verifyUser.dto";
import RequestVerifyUserDTO from "../dto/requestVerifyUser.dto";
import { LoginServiceResponse } from "../responses/login.response";
import TokenResponse from "../responses/token.response";

class AuthService {
  usersRepository: Repository<Users>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(Users);
  }

  public async register(registerData: RegisterDTO): Promise<string> {
    try {
      const hashedPassword = await hashPassword(registerData.password);
      const newUser = this.usersRepository.create({ ...registerData, password: hashedPassword });
      const user = await this.usersRepository.save(newUser);

      await this.createVerificationTokenAndSendByEmail(user.id, user.email);

      return "account created, please check your email to verify your account";
    } catch (error) {
      if (isQueryFailedError(error)) {
        if (error.code === "23505") {
          throw new BadRequestException("Email already exists");
        }
      }
      throw new InternalServerErrorException();
    }
  }

  public async login(loginData: LoginDTO, mRefreshToken: string | undefined): Promise<LoginServiceResponse> {
    if (mRefreshToken) {
      const decoded = verifyRefreshToken(mRefreshToken);
      if (decoded) throw new UnauthorizedException("You already logged in");
    }

    const user = await this.usersRepository
      .createQueryBuilder("users")
      .select(["users.email", "users.id", "users.password", "users.first_name", "users.last_name", "users.isVerified"])
      .where("users.email = :email", { email: loginData.email })
      .getOne();

    if (!user) throw new BadRequestException("Email or Password does not match");
    if (!user.password) throw new InternalServerErrorException();

    const isMatch = await comparePassword(loginData.password, user.password);
    if (!isMatch) throw new BadRequestException("Email or Password does not match");

    if (!user.isVerified) throw new UnauthorizedException("Please verify your account");

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });

    const userResponse = user.select("email", "first_name", "last_name");
    await redisClient.setEx(
      this.generateRedisKey("refresh", user.id, refreshToken),
      TokenExpiration.REFRESH,
      refreshToken,
    );

    return { accessToken, refreshToken, userResponse };
  }

  public async logout(refresh_token: string): Promise<void> {
    const tokenData = verifyRefreshToken(refresh_token);
    if (tokenData) {
      await redisClient.del(this.generateRedisKey("refresh", tokenData.id, refresh_token));
    }
    return;
  }

  public async refresh(token: string | undefined): Promise<TokenResponse> {
    /*
    Use Redis Whitelist (Honestly if not sure if I should use blacklist or whitelist)
    1. verify current refresh token, reject if invalid, otherwise continue
    2. check current refresh token from redis, if it exist remove it then continue
    3. generate new access & refresh token
    4. add newly created refresh token to redis with format {ID}_Refresh_{Token}
    5. return to user
    */

    if (token === undefined) throw new UnauthorizedException("Token is missing");

    const refreshTokenResponse = verifyRefreshToken(token);

    if (refreshTokenResponse === null) throw new UnauthorizedException("Invalid Token");

    await redisClient.del(this.generateRedisKey("refresh", refreshTokenResponse.id, token));

    const refreshToken = signRefreshToken({ id: refreshTokenResponse.id });
    const accessToken = signAccessToken({ id: refreshTokenResponse.id });

    await redisClient.setEx(
      this.generateRedisKey("refresh", refreshTokenResponse.id, refreshToken),
      TokenExpiration.REFRESH,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  public async requestResetPassword(data: ResetPasswordRequestDTO): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .select(["users.email", "users.id"])
      .where("users.email = :email", { email: data.email })
      .getOne();

    if (user) {
      const { token, key } = await signRequestToken({ id: user.id }, TokenExpiration.PASSWORD);

      await deleteScan(`${user.id}:password-reset:*`);
      await redisClient.setEx(this.generateRedisKey("password-reset", user.id, token), TokenExpiration.PASSWORD, key);

      const url = this.generateRequestURL("password-reset", token, user.id);
      await sendRequestResetPasswordMail(user.email, url.toString());
    }
  }

  public async resetPassword({ id, token, password }: ResetPasswordDTO): Promise<string> {
    /*
    Check if token is in whitelist, if not in whitelist reject
    verify token received, reject if error
    check if user exist, reject if not
    hash the new password
    update the new password on db
    delete all refresh token of the user on the whitelist
    delete the user's request password reset token on whitelist
    */

    const key = await redisClient.get(this.generateRedisKey("password-reset", id, token));
    if (key === null)
      throw new UnauthorizedException("your link has expired, please request a new password reset link");

    const decoded = verifyRequestToken(token, key);
    if (decoded === null)
      throw new UnauthorizedException("your link is invalid, please request a new password reset link");

    const user = await this.usersRepository.createQueryBuilder("users").select(["users.id"]).getOne();
    if (user === null) throw new NotFoundException("user not found");

    const hashedPassword = await hashPassword(password);

    await this.usersRepository
      .createQueryBuilder("users")
      .update()
      .set({ password: hashedPassword })
      .where("users.id = :id", { id: user.id })
      .execute();

    await deleteScan(`${user.id}:refresh"*`);
    await redisClient.del(this.generateRedisKey("password-reset", user.id, token));

    return "password has been succesfully changed";
  }

  public async requestVerification(data: RequestVerifyUserDTO): Promise<string> {
    /*
    Check if user exists by email, reject if not found
    delete all verification request token for the user
    generate new verification token for the user
    add the token to the whitelist
    generate url for the user with params of userId and verify token
    send an email to the user with the url
    */
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .select(["users.id", "users.email", "users.isVerified"])
      .where("users.email = :email", { email: data.email })
      .getOne();

    if (user !== null) {
      if (user.isVerified) throw new BadRequestException("user is already verified");

      await deleteScan(`${user.id}:verify:*`);

      await this.createVerificationTokenAndSendByEmail(user.id, user.email);
    }

    return "verification request has been sent to your email";
  }

  public async verifyUser(data: VerifyUserDTO): Promise<string> {
    /*
    check token in whitelist to get the token and key, reject if not found
    verify token, reject if error
    check if user exists, reject if not found
    change verification status of the user to verified
    remove the token from the whitelist
    */
    const userVerificationKey = await redisClient.get(this.generateRedisKey("verify", data.userId, data.token));
    if (userVerificationKey === null) throw new UnauthorizedException("Invalid token");

    const decoded = verifyRequestToken(data.token, userVerificationKey);
    if (decoded === null) throw new UnauthorizedException("Token is invalid");

    if (decoded.id !== data.userId) throw new UnauthorizedException("Token is invalid");

    const user = await this.usersRepository
      .createQueryBuilder("users")
      .select(["users.id", "users.isVerified"])
      .where("users.id = :id", { id: data.userId })
      .getOne();

    if (user === null) throw new NotFoundException("User not found");

    await this.usersRepository
      .createQueryBuilder("users")
      .update()
      .set({ isVerified: true })
      .where("users.id = :id", { id: data.userId })
      .execute();

    await redisClient.del(this.generateRedisKey("verify", data.userId, data.token));

    return "User has been verified";
  }

  private async createVerificationTokenAndSendByEmail(userId: string, email: string) {
    const { token, key } = await signRequestToken({ id: userId }, TokenExpiration.VERIFY);
    await redisClient.setEx(this.generateRedisKey("verify", userId, token), TokenExpiration.VERIFY, key);
    const url = this.generateRequestURL("verify", token, userId);

    await sendVerificationMail(email, url.toString());
  }

  /**
   * format key for redis whitelist
   * @param {"verify" | "refresh" | "password-reset"} type type of key
   * @param {string} userId user id
   * @param {string} token token
   * @returns {string} formatted key
   */
  private generateRedisKey(type: "verify" | "refresh" | "password-reset", userId: string, token: string): string {
    return `${userId}:${type}:${token}`;
  }

  /**
   * generate request url for account verification and password reset
   * @param {"verify" | "password-reset"} type
   * @param {string} token token to set as search param
   * @param {string} userId userId to set as search param
   * @returns
   */
  private generateRequestURL(type: "verify" | "password-reset", token: string, userId: string): URL {
    const path = `/${type}`;

    const url = new URL(`https://localhost:3000${path}`);
    url.searchParams.set("token", token);
    url.searchParams.set("id", userId);

    return url;
  }
}
export default AuthService;
