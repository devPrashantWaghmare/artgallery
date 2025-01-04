import Redis from 'ioredis';
// import { RedisAdapter } from "@next-auth/redis-adapter";


// Redis client setup
const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export { redisClient };
