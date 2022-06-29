import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middlewares/auth.middleware';
import UsersService from './users.service';

class UsersController implements Controller {
  public path: string = '/users';
  public router: Router = Router();
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('', authMiddleware, this.getUsers);
  }

  private getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send(await this.usersService.getUsers());
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
