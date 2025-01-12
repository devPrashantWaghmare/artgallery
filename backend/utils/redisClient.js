const Redis = require("ioredis");

let redisClient;



// Initialize Redis Client
const initializeRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,
    });

    // Error handling
    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("ℹ️ Redis client is connecting...");
    });

    redisClient.on("ready", () => {
      console.log("✅ Redis client connected successfully.");
    });

    redisClient.on("end", () => {
      console.log("ℹ️ Redis connection closed.");
    });
  }
  return redisClient;
};

// Function to connect to Redis
const connectRedis = async () => {
  if (redisClient && redisClient.status === "ready") {
    console.log("ℹ️ Redis is already connected.");
    return redisClient;
  } else if (redisClient && redisClient.status === "connecting") {
    console.log("ℹ️ Redis is already connecting.");
    return redisClient;
  } else {
    try {
      const client = initializeRedisClient();
      await client.connect();
      console.log("✅ Connected to Redis.");
      return client;
    } catch (error) {
      console.error("❌ Failed to connect to Redis:", error.message);
      throw error;
    }
  }
};


// Function to disconnect from Redis
const disconnectRedis = async () => {
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.quit();
      console.log("✅ Disconnected from Redis.");
    } else {
      console.log("ℹ️ Redis client is not connected.");
    }
  } catch (error) {
    console.error("❌ Failed to disconnect from Redis:", error.message);
  }
};

// Function to cache user data
const cacheUserData = async (key, data, ttl = 3600) => {
  try {
    const jsonData = JSON.stringify(data);
    await redisClient.set(key, jsonData, "EX", ttl);
    console.log(`✅ Cached data under key: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to cache data under key: ${key}`, error.message);
  }
};

// Function to retrieve user data from cache
const getUserFromCache = async (key) => {
  try {
  console.log("getUserFromCache : key recieved",key);
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`✅ Data retrieved from cache for key: ${key}`);
      return JSON.parse(cachedData);
    } else {
      console.log(`ℹ️ No data found in cache for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to retrieve data for key: ${key}`, error.message);
    return null;
  }
};

// Function to delete cached user data
const deleteUserFromCache = async (key) => {
  try {
    await redisClient.del(key);
    console.log(`✅ Deleted cached data for key: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to delete cached data for key: ${key}`, error.message);
  }
};

module.exports = {
  connectRedis,
  disconnectRedis,
  cacheUserData,
  getUserFromCache,
  deleteUserFromCache,
  initializeRedisClient,
};
