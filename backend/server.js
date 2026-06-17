require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { generalLimiter } = require("./src/config/rateLimiter");
const logger = require("./src/config/logger");

const authRoutes = require("./src/routes/auth");
const recipeRoutes = require("./src/routes/recipes");

const app = express();

// Segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Compressão de respostas
app.use(compression());

// Parse JSON
app.use(express.json());

// Rate limiting geral
app.use(generalLimiter);

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Handler de erros globais
app.use((err, req, res, next) => {
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
