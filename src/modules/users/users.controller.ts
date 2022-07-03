import { Router, Request, Response, NextFunction } from 'express';
import BaseController from '../../interfaces/baseController.interface';
import authMiddleware from '../../middlewares/auth.middleware';
import UsersService from './users.service';
import { Multer } from 'multer';
import upload from '../../utils/multer.util';
import HttpException from '../../exceptions/http.exception';
import AuthResponseLocals from '../../interfaces/authResponseLocal.interface';
import { UpdatePhotoResponse } from './users.response';

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
  }

  private getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.send(await this.usersService.getUsers());
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
