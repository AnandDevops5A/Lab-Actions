import Redis from "ioredis";

const globalForRedis = global;

const client = globalForRedis.redis || new Redis(process.env.REDIS_URL);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = client;
}

export default client;
