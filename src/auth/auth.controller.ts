import { NextFunction, Request, Response, Router } from 'express';
import { RequestTypes } from '../common/enums/request.enum';
import { Cookies } from '../common/enums/token.enum';
import BaseController from '../common/interfaces/baseController.interface';
import validationMiddleware from '../common/middlewares/validation.middleware';
import { accessCookieOption, refreshCookieOption } from '../common/utils/token.util';
import { loginDTO, registerDTO } from './auth.dto';
import { LoginResponse, RegisterResponse } from './auth.response';
import AuthService from './auth.service';

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
    this.router.post('/login', validationMiddleware(loginDTO, RequestTypes.BODY), this.loginHandler);
    this.router.post('/register', validationMiddleware(registerDTO, RequestTypes.BODY), this.registerHandler);
  }

  private registerHandler = async (
    req: Request<Record<string, never>, RegisterResponse, registerDTO>,
    res: Response<RegisterResponse>,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      const message = await this.authService.register(body);
      return res.send({ message });
    } catch (error) {
      return next(error);
    }
  };

  private loginHandler = async (
    req: Request<Record<string, never>, LoginResponse, loginDTO>,
    res: Response<LoginResponse>,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      const oldRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      if (oldRefreshToken === undefined) {
        res.clearCookie('refresh');
      }
      const { accessToken, refreshToken, userResponse } = await this.authService.login(body, oldRefreshToken);
      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);
      return res.status(201).send({ user: userResponse });
    } catch (error) {
      return next(error);
    }
  };

  private logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      if (mRefreshToken) {
        await this.authService.logout(mRefreshToken);
      }
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  private refreshHandler = async (req: Request, res: Response<LoginResponse>, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      const { accessToken, refreshToken, userResponse } = await this.authService.refresh(mRefreshToken);

      res.cookie(Cookies.ACCESS_TOKEN, accessToken, accessCookieOption);
      res.cookie(Cookies.REFRESH_TOKEN, refreshToken, refreshCookieOption);

      return res.send({ user: userResponse });
    } catch (error) {
      res.clearCookie(Cookies.ACCESS_TOKEN);
      res.clearCookie(Cookies.REFRESH_TOKEN);
      return next(error);
    }
  };
}

export default AuthController;
