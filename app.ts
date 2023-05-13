import express, { Application } from "express";
import { Server } from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorMiddleware from "./src/common/middlewares/error.middleware";
import NotFoundMiddleware from "./src/common/middlewares/notfound.middleware";
import httpLogger from "./src/common/logger/httpLogger";
import logger from "./src/common/logger/logger";
import BaseController from "./src/common/controllers/base.controller";
import redisClient from "./src/common/config/redis";

class App {
  public app: Application;

  public port: number;

  constructor(controllers: BaseController[], port: number) {
    this.app = express();
    this.initAppConfig();
    this.port = port;
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorHandling();
    this.initRouteNotFound();
  }

  private initAppConfig() {
    /* 
    Uncomment below if running under proxy like nginx, apache, etc
    so that req.ip returns the client's IP instead of the proxy's IP.
    (you can also use req.headers["x-forwarded-for"] but)
    */
    // this.app.set("trust proxy", "127.0.0.1")
    this.app.disable("x-powered-by");
  }

  private initMiddlewares() {
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(httpLogger);
  }

  private initControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use(`/api${controller.path}`, controller.router);
    });
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initRouteNotFound() {
    this.app.use(NotFoundMiddleware);
  }

  public listen(): Server {
    const server = this.app.listen(this.port, () => {
      logger.info(`Server ready at port: ${this.port}`);
    });
    return server;
  }
}

export default App;
