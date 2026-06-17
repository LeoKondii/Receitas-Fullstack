const { Pool } = require("pg");
const logger = require("./logger");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  logger.error(`Erro no pool de conexões: ${err.message}`);
});

pool.on("connect", () => {
  logger.info("Nova conexão estabelecida com o PostgreSQL");
});

module.exports = pool;
