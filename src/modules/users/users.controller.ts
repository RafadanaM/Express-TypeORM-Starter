import { Router, Request, Response, NextFunction } from 'express';
import BaseController from '../../interfaces/baseController.interface';
import authMiddleware from '../../middlewares/auth.middleware';
import UsersService from './users.service';

class UsersController implements BaseController {
  public path: string;
  public router: Router;
  private usersService: UsersService;

  constructor() {
    this.path = '/users';
    this.router = Router();
    this.usersService = new UsersService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('', authMiddleware, this.getUsers);
  }

  private getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.send(await this.usersService.getUsers());
    } catch (error) {
      return next(error);
    }
  };
}

export default UsersController;
