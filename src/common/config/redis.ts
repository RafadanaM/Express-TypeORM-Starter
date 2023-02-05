import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('connect', () => console.log('Redis Connected'));
redisClient.on('error', (e) => console.log(e));

export default redisClient;
