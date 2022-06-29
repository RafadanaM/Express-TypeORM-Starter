import express, { Response } from 'express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import NotFoundMiddleware from './middlewares/notfound.middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

class App {
  public app: express.Application;

  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initLogger();
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initErrorHandling();
    this.initRouteNotFound();
  }

  private initLogger() {
    morgan.token(`status`, (req, res: Response) => {
      const status = (typeof res.headersSent !== `boolean` ? Boolean(res.header) : res.headersSent)
        ? res.statusCode
        : '-';

      // get status color
      const color =
        status >= 500
          ? 31 // red
          : status >= 400
          ? 33 // yellow
          : status >= 300
          ? 36 // cyan
          : status >= 200
          ? 32 // green
          : 0; // no color
      return `\x1b[${color}m${status}\x1b[0m`;
    });
    this.app.use(morgan('[:date] :method :url :status :response-time ms - :res[content-length]'));
  }

  private initMiddlewares() {
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

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`app is listening on port ${this.port}`);
    });
  }
}

export default App;
