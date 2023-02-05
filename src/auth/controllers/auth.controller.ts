import { NextFunction, Router } from 'express';
import { RequestTypes } from '../../common/enums/request.enum';
import { Cookies } from '../../common/enums/token.enum';
import validationMiddleware from '../../common/middlewares/validation.middleware';
import { accessCookieOption, refreshCookieOption } from '../../common/utils/token.util';
import AuthService from '../services/auth.service';
import BaseController from '../../common/controllers/base.controller';
import LoginDTO from '../dto/login.dto';
import RegisterDTO from '../dto/register.dto';
import RegisterRequest from '../requests/register.request';
import { BaseResponse } from '../../common/responses/base.response';
import { LoginResponse } from '../responses/login.response';
import LoginRequest from '../requests/login.request';
import BaseRequest from '../../common/requests/base.request';

class AuthController implements BaseController {
  public path: string;
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.path = '/auth';
    this.router = Router();
    this.authService = new AuthService();
    this.initRoutes();
  }
  private initRoutes() {
    this.router.get('/refresh', this.refreshHandler.bind(this));
    this.router.get('/logout', this.logoutHandler.bind(this));
    this.router.post('/login', validationMiddleware(LoginDTO, RequestTypes.BODY), this.loginHandler.bind(this));
    this.router.post(
      '/register',
      validationMiddleware(RegisterDTO, RequestTypes.BODY),
      this.registerHandler.bind(this),
    );
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
      return res.send({ statusCode: 200, message: 'successfully logged in', user: userResponse });
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
      return res.send({ statusCode: 200, message: 'successfully logged out' });
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

      return res.send({ statusCode: 200, message: 'token refreshed' });
    } catch (error) {
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return next(error);
    }
  }
}

export default AuthController;
