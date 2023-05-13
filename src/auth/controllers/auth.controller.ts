import { NextFunction, Router } from "express";
import { Cookies } from "../../common/enums/token.enum";
import { accessCookieOption, refreshCookieOption } from "../../common/utils/token.util";
import AuthService from "../services/auth.service";
import BaseController from "../../common/controllers/base.controller";
import RegisterRequest from "../requests/register.request";
import { BaseResponse } from "../../common/responses/base.response";
import { LoginResponse } from "../responses/login.response";
import LoginRequest from "../requests/login.request";
import BaseRequest from "../../common/requests/base.request";
import RequestPasswordResetRequest from "../requests/resetPasswordRequest.request";
import RequestVerifyUserRequest from "../requests/requestVerifyUser.request";
import { IsAuthenticatedResponse } from "../responses/isAuthenticated.response";
import { LoginSchema } from "../schemas/login.schema";
import validateRequest from "../../common/middlewares/validateRequest.middleware";
import { RegisterSchema } from "../schemas/register.schema";
import { VerifyUserSchema } from "../schemas/verifyUser.schema";
import { RequestVerifyUserSchema } from "../schemas/requestVerifyUser.schema";
import { ResetPasswordRequestSchema } from "../schemas/resetPasswordRequest.schema";
import { ResetPasswordSchema } from "../schemas/resetPassword.schema";
import PasswordResetRequest from "../requests/resetPassword.request";
import VerifyUserRequest from "../requests/verifyUser.request";

class AuthController implements BaseController {
  public path: string;

  public router: Router;

  private authService: AuthService;

  constructor() {
    this.path = "/auth";
    this.router = Router();
    this.authService = new AuthService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/verify", validateRequest({ body: VerifyUserSchema }), this.verifyUserHandler.bind(this));
    this.router.post(
      "/verify/request",
      validateRequest({ body: RequestVerifyUserSchema }),
      this.requestVerifyUserHandler.bind(this),
    );
    this.router.get("/refresh", this.refreshHandler.bind(this));
    this.router.get("/me", this.isAuthenticatedHandler.bind(this));
    this.router.post(
      "/reset-password/request",
      validateRequest({ body: ResetPasswordRequestSchema }),
      this.requestResetPasswordHandler.bind(this),
    );
    this.router.patch(
      "/reset-password",
      validateRequest({ body: ResetPasswordSchema }),
      this.resetPasswordHandler.bind(this),
    );
    this.router.get("/logout", this.logoutHandler.bind(this));
    this.router.post("/login", validateRequest({ body: LoginSchema }), this.loginHandler.bind(this));
    this.router.post("/register", validateRequest({ body: RegisterSchema }), this.registerHandler.bind(this));
  }

  private async isAuthenticatedHandler(_req: BaseRequest, res: IsAuthenticatedResponse, next: NextFunction) {
    try {
      return res.send({ statusCode: 200, message: "user is authenticated", isAuthenticated: true });
    } catch (error) {
      return next(error);
    }
  }

  private async registerHandler(req: RegisterRequest, res: BaseResponse, next: NextFunction) {
    try {
      const body = req.body;
      const message = await this.authService.register(body);
      return res.send({ statusCode: 200, message });
    } catch (error) {
      return next(error);
    }
  }

  private async loginHandler(req: LoginRequest, res: LoginResponse, next: NextFunction) {
    try {
      const body = req.body;
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];

      const { accessToken, refreshToken, userResponse } = await this.authService.login(body, mRefreshToken);
      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);
      return res.send({ statusCode: 200, message: "successfully logged in", user: userResponse });
    } catch (error) {
      return next(error);
    }
  }

  private async logoutHandler(req: BaseRequest, res: BaseResponse, next: NextFunction) {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      if (mRefreshToken) {
        await this.authService.logout(mRefreshToken);
      }
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return res.send({ statusCode: 200, message: "successfully logged out" });
    } catch (error) {
      return next(error);
    }
  }

  private async refreshHandler(req: BaseRequest, res: BaseResponse, next: NextFunction) {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      const { accessToken, refreshToken } = await this.authService.refresh(mRefreshToken);

      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);

      return res.send({ statusCode: 200, message: "token refreshed" });
    } catch (error) {
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return next(error);
    }
  }

  private async requestResetPasswordHandler(req: RequestPasswordResetRequest, res: BaseResponse, next: NextFunction) {
    try {
      const body = req.body;

      await this.authService.requestResetPassword(body);
      return res.send({ statusCode: 200, message: "Password request has been sent to your email" });
    } catch (error) {
      return next(error);
    }
  }

  private async resetPasswordHandler(req: PasswordResetRequest, res: BaseResponse, next: NextFunction) {
    try {
      const body = req.body;
      const message = await this.authService.resetPassword(body);
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return res.send({ statusCode: 200, message });
    } catch (error) {
      return next(error);
    }
  }

  private async verifyUserHandler(req: VerifyUserRequest, res: BaseResponse, next: NextFunction) {
    try {
      const body = req.body;
      const message = await this.authService.verifyUser(body);
      return res.send({ statusCode: 200, message });
    } catch (error) {
      return next(error);
    }
  }

  private async requestVerifyUserHandler(req: RequestVerifyUserRequest, res: BaseResponse, next: NextFunction) {
    try {
      const body = req.body;
      const message = await this.authService.requestVerification(body);
      return res.send({ statusCode: 200, message });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
