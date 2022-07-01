import { NextFunction, Request, Response, Router } from 'express';
import { RequestTypes } from '../../enums/request.enum';
import { Cookies } from '../../enums/token.enum';

import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import { refreshCookieOption } from '../../utils/token.util';
import { loginDTO, registerDTO } from './auth.dto';

import AuthService from './auth.service';

class AuthController implements Controller {
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
    this.router.get('/refresh', this.refresh);
    this.router.get('/logout', this.logout);
    this.router.post('/login', validationMiddleware(loginDTO, RequestTypes.BODY), this.login);
    this.router.post('/register', validationMiddleware(registerDTO, RequestTypes.BODY), this.register);
  }

  private register = async (
    req: Request<Record<string, never>, Record<string, never>, registerDTO>,
    res: Response,
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

  private login = async (
    req: Request<Record<string, never>, Record<string, never>, loginDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = req.body;
      const oldRefreshToken: string | undefined = req.cookies[Cookies.RefreshToken];
      if (oldRefreshToken === undefined) {
        res.clearCookie('refresh');
      }
      const { accessToken, refreshToken } = await this.authService.login(body, oldRefreshToken);
      res.cookie('refresh', refreshToken, refreshCookieOption);
      return res.send({ accessToken });
    } catch (error) {
      return next(error);
    }
  };

  private logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.RefreshToken];
      if (mRefreshToken) {
        await this.authService.logout(mRefreshToken);
      }
      res.clearCookie('refresh');
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  private refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mRefreshToken: string | undefined = req.cookies[Cookies.RefreshToken];
      const { accessToken, refreshToken } = await this.authService.refreshHandler(mRefreshToken);
      res.cookie('refresh', refreshToken, refreshCookieOption);

      return res.send({ accessToken });
    } catch (error) {
      res.clearCookie('refresh');
      return next(error);
    }
  };
}

export default AuthController;
