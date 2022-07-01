import express from 'express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import NotFoundMiddleware from './middlewares/notfound.middleware';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import loggerMiddleware from './logger/loggerMiddleware';
import logger from './logger/logger';

class App {
  public app: express.Application;

  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorHandling();
    this.initRouteNotFound();
    this.initUnhandledRejection()
    this.initUncaughtException()
  }

  private initMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(cors({ origin: process.env.ORIGIN }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initControllers(controllers: Controller[]) {
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

  private initUnhandledRejection() {
    process.on('unhandledRejection', (error: Error) => {
      throw error;
    });
  }

  private initUncaughtException() {
    process.on('uncaughtException', (error: Error) => {
      logger.error(error);
      process.exit(1);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`app is listening on port ${this.port}`);
    });
  }
}

export default App;
