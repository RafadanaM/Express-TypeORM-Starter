import 'dotenv/config';
import App from '../../app';
import UsersController from '../../src/modules/users/users.controller';
import validateEnv from '../../src/utils/validateEnv';
import 'reflect-metadata';
import AppDataSource from '../../src/data-source';
import AuthController from '../../src/modules/auth/auth.controller';
validateEnv();

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    const app = new App([new AuthController(), new UsersController()], parseInt(process.env.PORT || '5000'));
    app.listen();
  })
  .catch((error) => console.log(error));
