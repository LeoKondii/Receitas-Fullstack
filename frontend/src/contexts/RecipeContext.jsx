import { createContext, useContext, useReducer, useCallback, useRef } from "react";
import { recipeReducer, initialState } from "./recipeReducer";
import api from "../services/api";



const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const debounceTimer = useRef(null);

  const searchRecipes = useCallback(async (term) => { // função para buscar receitas, com debounce
    dispatch({ type: "SET_SEARCH_TERM", payload: term });

    if (!term || term.trim().length < 2) {
      dispatch({ type: "CLEAR_RESULTS" });
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const normalizeRecipe = (recipe) => ({
      ...recipe,
      id: recipe.id || recipe.idMeal || null,
      strMeal: recipe.strMeal || recipe.name || "",
      strCategory: recipe.strCategory || recipe.category || "",
      strArea: recipe.strArea || recipe.area || "",
      strMealThumb: recipe.strMealThumb || recipe.thumbnail || "",
      strInstructions: recipe.strInstructions || recipe.instructions || "",
      strYoutube: recipe.strYoutube || recipe.youtube_link || "",
    });

    debounceTimer.current = setTimeout(async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const response = await api.get("/recipes", {
          params: { s: term.trim() },
        });

        const meals = Array.isArray(response.data)
          ? response.data.map(normalizeRecipe).slice(0, 12)
          : [];

        dispatch({ type: "SET_RECIPES", payload: meals });
      } catch (err) {
        console.error("Erro na busca local:", err);

        try {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term.trim())}`
          );

          if (!response.ok) throw new Error("Erro na requisição do TheMealDB");

          const data = await response.json();
          const meals = data.meals ? data.meals.map(normalizeRecipe).slice(0, 12) : [];
          dispatch({ type: "SET_RECIPES", payload: meals });
        } catch (fallbackErr) {
          console.error("Erro na busca fallback:", fallbackErr);
          dispatch({ type: "SET_ERROR", payload: "Erro ao buscar receitas" });
        }
      }
    }, 400);
  }, []);

  const selectRecipe = useCallback((recipe) => {
    dispatch({ type: "SET_SELECTED_RECIPE", payload: recipe });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: "SET_SELECTED_RECIPE", payload: null });
  }, []);

  return (
    <RecipeContext.Provider value={{ state, searchRecipes, selectRecipe, closeModal }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe deve ser usado dentro de RecipeProvider");
  }
  return context;
}