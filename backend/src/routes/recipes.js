const express = require("express");
const { body, query, validationResult } = require("express-validator");
const RecipeModel = require("../models/RecipeModel");
const authMiddleware = require("../config/authMiddleware");
const redis = require("../config/redis");
const logger = require("../config/logger");

const router = express.Router();

const VALID_TAGS = [ //expandindo a lista de tags válidas 
  "vegetariana",
  "bife",
  "frango",
  "acompanhamento",
  "sobremesa",
  "frutos do mar",
];

// GET /api/recipes?s=termo
router.get(
  "/",
  authMiddleware,
  [query("s").trim().notEmpty().withMessage("Termo de busca é obrigatório")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const term = req.query.s;
    const cacheKey = `search:${term.toLowerCase()}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit para busca: ${term}`);
        return res.json(JSON.parse(cached));
      }

      const recipes = await RecipeModel.search(term);

      await redis.set(cacheKey, JSON.stringify(recipes), "EX", 300);

      logger.info(`Busca realizada por usuário ${req.userId}: "${term}"`);

      res.json(recipes);
    } catch (err) {
      logger.error(`Erro na busca: ${err.message}`);
      res.status(500).json({ error: "Erro ao buscar receitas" });
    }
  }
);

// POST /api/recipes
router.post(
  "/",
  authMiddleware,
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("category").trim().notEmpty().withMessage("Categoria é obrigatória"),
    body("area").trim().notEmpty().withMessage("País de origem é obrigatório"),
    body("instructions").trim().notEmpty().withMessage("Modo de preparo é obrigatório"),
    body("tag")
      .trim()
      .notEmpty()
      .withMessage("Tag é obrigatória")
      .isIn(VALID_TAGS)
      .withMessage("Tag inválida"),
    body("ingredients")
      .isArray({ min: 1 })
      .withMessage("Pelo menos um ingrediente é obrigatório"),
    body("ingredients.*.name")
      .trim()
      .notEmpty()
      .withMessage("Nome do ingrediente é obrigatório"),
    body("ingredients.*.measure")
      .trim()
      .notEmpty()
      .withMessage("Medida do ingrediente é obrigatória"),
    body("youtubeLink")
      .optional({ nullable: true, checkFalsy: true })
      .isURL()
      .withMessage("Link do YouTube inválido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, area, instructions, youtubeLink, tag, ingredients } = req.body;

    try {
      const recipe = await RecipeModel.create({
        userId: req.userId,
        name,
        category,
        area,
        instructions,
        youtubeLink,
        tag,
      });

      await RecipeModel.addIngredients(recipe.id, ingredients);

      const fullRecipe = await RecipeModel.findById(recipe.id);

      logger.info(`Receita inserida por usuário ${req.userId}: "${name}"`);

      res.status(201).json(fullRecipe);
    } catch (err) {
      logger.error(`Erro ao inserir receita: ${err.message}`);
      res.status(500).json({ error: "Erro ao inserir receita" });
    }
  }
);

module.exports = router;
