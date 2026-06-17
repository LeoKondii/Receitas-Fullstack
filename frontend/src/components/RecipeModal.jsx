import { useEffect } from "react";
import { useRecipe } from "../contexts/RecipeContext";
import "./RecipeModal.css";

function getIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ name: ingredient.trim(), measure: measure?.trim() || "" });
    }
  }
  return ingredients;
}

export default function RecipeModal() {
  const { state, closeModal } = useRecipe();
  const { selectedRecipe } = state;

  useEffect(() => {
    document.body.style.overflow = selectedRecipe ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedRecipe]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeModal]);

  if (!selectedRecipe) return null;

  const ingredients = getIngredients(selectedRecipe);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-panel">
        <button className="modal-close" onClick={closeModal}>✕</button>

        <div className="modal-image-wrapper">
          <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="modal-image" />
          <div className="modal-image-gradient" />
        </div>

        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{selectedRecipe.strMeal}</h2>
            <div className="modal-meta">
              {selectedRecipe.strCategory && (
                <span className="modal-tag modal-tag--category">{selectedRecipe.strCategory}</span>
              )}
              {selectedRecipe.strArea && (
                <span className="modal-tag modal-tag--area">🌍 {selectedRecipe.strArea}</span>
              )}
            </div>
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <h3 className="modal-section-title">Ingredientes</h3>
              <ul className="modal-ingredients">
                {ingredients.map((ing, index) => (
                  <li key={index} className="modal-ingredient">
                    <span className="modal-ingredient-measure">{ing.measure}</span>
                    <span className="modal-ingredient-name">{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h3 className="modal-section-title">Modo de Preparo</h3>
              <p className="modal-instructions">{selectedRecipe.strInstructions}</p>
            </div>

            {selectedRecipe.strYoutube && (
              <a href={selectedRecipe.strYoutube} target="_blank" rel="noopener noreferrer" className="modal-youtube-link">
                <span>▶</span> Assistir no YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}