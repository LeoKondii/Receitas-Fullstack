const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const { authLimiter } = require("../config/rateLimiter");
const logger = require("../config/logger");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter pelo menos 6 caracteres"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await UserModel.create({ name, email, passwordHash });

      logger.info(`Novo usuário cadastrado: ${email}`);

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      logger.error(`Erro no registro: ${err.message}`);
      res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await UserModel.findByEmail(email);

      if (!user) {
        logger.warn(`Tentativa de login com email inexistente: ${email}`);
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        logger.warn(`Senha incorreta para o usuário: ${email}`);
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      logger.info(`Login realizado: ${email}`);

      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      logger.error(`Erro no login: ${err.message}`);
      res.status(500).json({ error: "Erro ao realizar login" });
    }
  }
);

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  logger.info("Logout realizado");
  res.json({ message: "Logout realizado com sucesso" });
});

module.exports = router;
