import { useRecipe } from "../contexts/RecipeContext";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const { selectRecipe } = useRecipe();

  return (
    <article className="recipe-card" onClick={() => selectRecipe(recipe)}>
      <div className="recipe-card-image-wrapper">
        {recipe.strMealThumb ? (
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal || recipe.name}
            className="recipe-card-image"
            loading="lazy"
          />
        ) : (
          <div className="recipe-card-no-image">🍽</div>
        )}
        <div className="recipe-card-overlay">
          <button
            className="recipe-card-btn"
            onClick={(e) => { e.stopPropagation(); selectRecipe(recipe); }}
          >
            Ver Receita
          </button>
        </div>
      </div>
      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.strMeal || recipe.name}</h2>
        <div className="recipe-card-meta">
          {(recipe.strCategory || recipe.category) && (
            <span className="recipe-card-tag recipe-card-tag--category">
              {recipe.strCategory || recipe.category}
            </span>
          )}
          {(recipe.strArea || recipe.area) && (
            <span className="recipe-card-tag recipe-card-tag--area">
              🌍 {recipe.strArea || recipe.area}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}