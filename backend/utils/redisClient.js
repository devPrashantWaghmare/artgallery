//backend/utils/redisClient.js

const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Function to connect to Redis
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            console.log('Connected to Redis');
        } catch (error) {
            console.error('Failed to connect to Redis:', error.message);
            throw error;
        }
    }
};

// Function to disconnect from Redis
const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        try {
            await redisClient.quit();
            console.log('Disconnected from Redis');
        } catch (error) {
            console.error('Failed to disconnect from Redis:', error.message);
        }
    }
};

module.exports = { redisClient, connectRedis, disconnectRedis };
