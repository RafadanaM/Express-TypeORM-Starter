import { NextFunction, Request, Response, Router } from 'express';
import { RequestTypes } from '../../enums/request.enum';
import { Cookies } from '../../enums/token.enum';
import BaseController from '../../interfaces/baseController.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import { refreshCookieOption } from '../../utils/token.util';
import { loginDTO, registerDTO } from './auth.dto';
import { AccessTokenResponse, RegisterResponse } from './auth.response';
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
      const response = await this.authService.register(body);
      return res.send(response);
    } catch (error) {
      return next(error);
    }
  };


  private loginHandler = async (
    req: Request<Record<string, never>, AccessTokenResponse, loginDTO>,
    res: Response<AccessTokenResponse>,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      const oldRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      if (oldRefreshToken === undefined) {
        res.clearCookie('refresh');
      }
      const { accessToken, refreshToken } = await this.authService.login(body, oldRefreshToken);
      res.cookie('refresh', refreshToken, refreshCookieOption);
      return res.status(201).send({ accessToken });
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
      res.clearCookie('refresh');
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  private refreshHandler = async (req: Request, res: Response<AccessTokenResponse>, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.REFRESH_TOKEN];
      const { accessToken, refreshToken } = await this.authService.refresh(mRefreshToken);
      res.cookie('refresh', refreshToken, refreshCookieOption);

      return res.send({ accessToken });
    } catch (error) {
      res.clearCookie('refresh');
      return next(error);
    }
  };
}

export default AuthController;
