import { useRecipe } from "../contexts/RecipeContext";
import RecipeCard from "./RecipeCard";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import "./RecipeList.css";

export default function RecipeList() {
  const { state } = useRecipe();
  const { recipes, loading, error, searchTerm } = state;

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message={error} />;

  if (searchTerm.length >= 2 && recipes.length === 0) {
    return (
      <div className="recipe-list-empty" role="status">
        <span className="recipe-list-empty-icon">🍽</span>
        <p>Nenhuma receita encontrada!</p>
        <span className="recipe-list-empty-sub">Tente outro termo de busca</span>
      </div>
    );
  }

  if (recipes.length === 0) return null;

  return (
    <section className="recipe-list-section">
      <div className="recipe-list-header">
        <span className="recipe-list-count">
          {recipes.length} receita{recipes.length !== 1 ? "s" : ""} encontrada{recipes.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <RecipeCard key={recipe.id || recipe.idMeal || index} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}