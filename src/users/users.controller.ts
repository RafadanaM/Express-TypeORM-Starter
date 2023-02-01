import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../common/middlewares/auth.middleware';
import UsersService from './users.service';
import { Multer } from 'multer';
import upload from '../common/utils/multer.util';
import HttpException from '../common/exceptions/http.exception';
import { UpdatePhotoResponse } from './users.response';
import Users from './users.entity';
import BaseController from '../common/controllers/base.controller';
import AuthResponseLocals from '../common/responses/authLocals.response';

class UsersController implements BaseController {
  public path: string;
  public router: Router;
  private userUpload: Multer;
  private usersService: UsersService;

  constructor() {
    this.path = '/users';
    this.router = Router();
    this.userUpload = upload('users/', true, (_req, file, callback) => {
      const valid = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png';
      callback(null, valid);
    });
    this.usersService = new UsersService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('', authMiddleware, this.getUsersHandler);
    this.router.patch('', authMiddleware, this.userUpload.single('photo'), this.updateAvatarHandler);
    this.router.get('/profile', authMiddleware, this.getUserByEmailHandler);
  }

  private getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.send(await this.usersService.getUsers());
    } catch (error) {
      return next(error);
    }
  };

  private getUserByEmailHandler = async (
    _req: Request,
    res: Response<Users, AuthResponseLocals>,
    next: NextFunction,
  ) => {
    try {
      const email = res.locals.user_email;
      return res.send(await this.usersService.getUserByEmail(email));
    } catch (error) {
      return next(error);
    }
  };

  private updateAvatarHandler = async (
    req: Request<Record<string, never>>,
    res: Response<UpdatePhotoResponse, AuthResponseLocals>,
    next: NextFunction,
  ) => {
    try {
      const file = req.file;
      const email = res.locals.user_email;
      if (file) {
        const avatarPath = await this.usersService.updateAvatar(email, file.path);
        return res.send({ avatarPath });
      }
      throw new HttpException(400, 'Bad Request');
    } catch (error) {
      return next(error);
    }
  };
}

export default UsersController;
