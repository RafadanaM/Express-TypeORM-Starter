import { Router, NextFunction } from "express";
import authMiddleware from "../../common/middlewares/auth.middleware";
import UsersService from "../services/users.service";
import BaseController from "../../common/controllers/base.controller";
import BaseRequest from "../../common/requests/base.request";
import { UsersResponse } from "../responses/users.response";
import UserResponse from "../responses/user.response";

class UsersController implements BaseController {
  public path: string;

  public router: Router;

  private usersService: UsersService;

  constructor() {
    this.path = "/users";
    this.router = Router();
    this.usersService = new UsersService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("", authMiddleware, this.getUsersHandler.bind(this));
    this.router.get("/profile", authMiddleware, this.getUserHandler.bind(this));
  }

  private async getUsersHandler(_req: BaseRequest, res: UsersResponse, next: NextFunction) {
    try {
      const users = await this.usersService.getUsers();
      return res.send({ statusCode: 200, message: "users successfully retrieved", users });
    } catch (error) {
      return next(error);
    }
  }

  private async getUserHandler(_req: BaseRequest, res: UserResponse, next: NextFunction) {
    try {
      const userId = res.locals.userId;
      const user = await this.usersService.getUserById(userId);
      return res.send({ statusCode: 200, message: "user successfully retrieved", user });
    } catch (error) {
      return next(error);
    }
  }

  // private updateAvatarHandler = async (
  //   req: Request<Record<string, never>>,
  //   res: Response<UpdatePhotoResponseBody, AuthResponseLocals>,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const file = req.file;
  //     const email = res.locals.user_email;
  //     if (file) {
  //       const avatarPath = await this.usersService.updateAvatar(email, file.path);
  //       return res.send({ avatarPath });
  //     }
  //     throw new HttpException(400, 'Bad Request');
  //   } catch (error) {
  //     return next(error);
  //   }
  // };
}

export default UsersController;
