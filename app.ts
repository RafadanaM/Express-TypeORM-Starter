import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import Controller from './src/common/interfaces/baseController.interface';
import errorMiddleware from './src/common/middlewares/error.middleware';
import NotFoundMiddleware from './src/common/middlewares/notfound.middleware';
import httpLogger from './src/common/logger/httpLogger';
import logger from './src/common/logger/logger';
import options from './docs/swaggerOption';
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
    this.initUnhandledRejection();
    this.initUncaughtException();
  }

  private initMiddlewares() {
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
    // using nginx for compression is better, https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/delegatetoproxy.md
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(httpLogger);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options, { explorer: true }));
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
      console.log(`🚀 Server ready at port: ${this.port}`);
    });
  }
}

export default App;
