import redisClient from '../config/redis';

/**
 * delete values on redis based on key pattern
 * @param {string} pattern key pattern
 * @returns {void}
 */
async function deleteScan(pattern: string): Promise<void> {
  let cursor = 0;

  while (cursor >= 0) {
    const result = await redisClient.scan(+cursor, {
      MATCH: pattern,
    });
    if (result.keys.length > 0) {
      await redisClient.del(result.keys);
    }

    if (result.cursor === 0) return;
    cursor = result.cursor;
  }
}

export { deleteScan };
