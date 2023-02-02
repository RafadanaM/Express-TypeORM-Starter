import 'dotenv/config';
import 'reflect-metadata';
import App from '../../app';
import AppDataSource from '../../src/db/data-source';
import AuthController from '../../src/auth/controllers/auth.controller';
import UsersController from '../../src/users/controllers/users.controller';
import validateEnv from '../../src/common/utils/validateEnv';

validateEnv();

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    const app = new App([new AuthController(), new UsersController()], parseInt(process.env.PORT || '5000'));
    app.listen();
  })
  .catch((error) => console.log(error));
