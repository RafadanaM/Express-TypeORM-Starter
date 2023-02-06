import { createClient } from 'redis';
import logger from '../logger/logger';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('connect', () => logger.info('Redis Connected'));
redisClient.on('error', (e) => logger.error('Redis Error: ', e));

export default redisClient;
