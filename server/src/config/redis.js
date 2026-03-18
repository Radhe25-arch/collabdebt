const { createClient } = require('redis');
const logger = require('../utils/logger');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis error:', err));
redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

async function connectRedis() {
  await redisClient.connect();
}

// Simple cache helpers
const cache = {
  async get(key) {
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) : null;
  },
  async set(key, value, ttlSeconds = 60) {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  },
  async del(key) {
    await redisClient.del(key);
  },
  async invalidatePattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(keys);
  },
};

module.exports = { redisClient, connectRedis, cache };
