import "dotenv/config";
import "reflect-metadata";
import App from "../../app";
import AppDataSource from "../../db/data-source";
import AuthController from "../../src/auth/controllers/auth.controller";
import UsersController from "../../src/users/controllers/users.controller";
import validateEnv from "../../src/common/utils/validateEnv";
import terminate from "./terminate";
import logger from "../../src/common/logger/logger";
import redisClient from "../../src/common/config/redis";

validateEnv();
AppDataSource.initialize()
  .then(async (db) => {
    logger.info("Database - Connection status: connected");
    await redisClient.connect();

    const app = new App([new AuthController(), new UsersController()], parseInt(process.env.PORT || "5000"));
    const server = app.listen();

    const exitHandler = terminate(server, db, redisClient);

    process.on("SIGINT", exitHandler(0, "SIGINT"));
    process.on("SIGTERM", exitHandler(0, "SIGTERM"));
    process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
    process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  })
  .catch((error) => logger.error(error));
