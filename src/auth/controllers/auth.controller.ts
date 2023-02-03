import { NextFunction, Request, Response, Router } from 'express';
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
    this.router.get('/refresh', this.refreshHandler);
    this.router.get('/logout', this.logoutHandler);
    this.router.post('/login', validationMiddleware(LoginDTO, RequestTypes.BODY), this.loginHandler);
    this.router.post('/register', validationMiddleware(RegisterDTO, RequestTypes.BODY), this.registerHandler);
  }

  private registerHandler = async (req: RegisterRequest, res: BaseResponse, next: NextFunction) => {
    try {
      const body = req.body;
      const message = await this.authService.register(body);
      return res.send({ statusCode: 200, message });
    } catch (error) {
      return next(error);
    }
  };

  private loginHandler = async (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
    try {
      const body = req.body;
      const oldRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      if (oldRefreshToken === undefined) {
        res.clearCookie('refresh');
      }
      const { accessToken, refreshToken, userResponse } = await this.authService.login(body, oldRefreshToken);
      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);
      return res.send({ statusCode: 200, message: 'successfully logged in', user: userResponse });
    } catch (error) {
      return next(error);
    }
  };

  private logoutHandler = async (req: BaseRequest, res: BaseResponse, next: NextFunction) => {
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
  };

  private refreshHandler = async (req: BaseRequest, res: LoginResponse, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      const { accessToken, refreshToken, userResponse } = await this.authService.refresh(mRefreshToken);

      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);

      return res.send({ statusCode: 200, message: 'token refreshed', user: userResponse });
    } catch (error) {
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return next(error);
    }
  };
}

export default AuthController;
