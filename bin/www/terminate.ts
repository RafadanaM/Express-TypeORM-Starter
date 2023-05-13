import { Server } from "http";
import logger from "../../src/common/logger/logger";
import { DataSource } from "typeorm";
import redisClient from "../../src/common/config/redis";

const terminate = (server: Server, db: DataSource, cache: typeof redisClient, timeoutMs = 1000) => {
  return (exitCode: number, message: string) => (reason: unknown, _mPromise?: Promise<unknown>) => {
    // close db connection then exit;
    const exit = async () => {
      try {
        logger.info("Closing database");
        await db.destroy();
        logger.info("Database - Connection status: disconnected");
        logger.info("Closing cache store");
        await cache.quit();
      } catch (error) {
        logger.error(error);
      } finally {
        logger.info(`Exiting process with code of ${exitCode}`);
        process.exit(exitCode);
      }
    };
    logger.warn(`Server is shutting down due to: ${message}`);
    // you can check the possible types of reason and _mPromise on process.d.ts
    if (reason instanceof Error) {
      logger.error(reason.message, reason.stack);
    }

    server.close(exit);

    // force exit after specified time
    setTimeout(exit, timeoutMs).unref();
  };
};

export default terminate;
