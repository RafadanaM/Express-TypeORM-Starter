import { cleanEnv, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    PORT: str(),
    DB_HOST: str(),
    DB_PORT: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    NODE_ENV: str(),
    ORIGIN: str(),
    EMAIL: str(),
    EMAIL_PASSWORD: str(),
    access_token_private: str(),
    access_token_public: str(),
    refresh_token_private: str(),
    refresh_token_public: str(),
  });
}

export default validateEnv;
