import { createClient } from "redis";
import logger from "../logger/logger";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("connect", () => logger.info("Redis - Connection status: connected"));
redisClient.on("error", (e) => logger.error(`Redis - Connection status: error with reason ${e}`));
redisClient.on("end", () => logger.info("Redis - Connection status: disconnected"));

export default redisClient;
