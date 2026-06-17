const Redis = require("ioredis");
const logger = require("./logger");

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on("connect", () => {
    logger.info("Conectado ao Redis");
  });

  redis.on("error", (err) => {
    logger.error(`Erro no Redis: ${err.message}`);
  });
} else {
  // Cache em memória simples para desenvolvimento sem Redis
  const memoryCache = new Map();

  redis = {
    get: async (key) => memoryCache.get(key) || null,
    set: async (key, value, ...args) => {
      memoryCache.set(key, value);
      // Suporte a expiração: SET key value EX segundos
      const exIndex = args.indexOf("EX");
      if (exIndex !== -1) {
        const ttl = args[exIndex + 1] * 1000;
        setTimeout(() => memoryCache.delete(key), ttl);
      }
      return "OK";
    },
    del: async (key) => memoryCache.delete(key),
  };

  logger.info("Redis não configurado, usando cache em memória");
}

module.exports = redis;
