const pool = require("../config/database");

class RecipeModel {
  async search(term) {
    const result = await pool.query(
      `SELECT r.*, u.name as author_name,
        json_agg(json_build_object('name', i.name, 'measure', i.measure)) as ingredients
       FROM recipes r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN ingredients i ON i.recipe_id = r.id
       WHERE r.name ILIKE $1
          OR r.category ILIKE $1
          OR r.area ILIKE $1
          OR r.tag ILIKE $1
       GROUP BY r.id, u.name
       LIMIT 12`,
      [`%${term}%`]
    );
    return result.rows;
  }

  async create({ userId, name, category, area, instructions, youtubeLink, tag }) {
    const result = await pool.query(
      `INSERT INTO recipes (user_id, name, category, area, instructions, youtube_link, tag)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, name, category, area, instructions, youtubeLink || null, tag]
    );
    return result.rows[0];
  }

  async addIngredients(recipeId, ingredients) {
    const values = ingredients.map((ing, i) => {
      const offset = i * 3;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    });

    const params = ingredients.flatMap((ing) => [recipeId, ing.name, ing.measure]);

    await pool.query(
      `INSERT INTO ingredients (recipe_id, name, measure) VALUES ${values.join(", ")}`,
      params
    );
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT r.*, u.name as author_name,
        json_agg(json_build_object('name', i.name, 'measure', i.measure)) as ingredients
       FROM recipes r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN ingredients i ON i.recipe_id = r.id
       WHERE r.id = $1
       GROUP BY r.id, u.name`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new RecipeModel();
