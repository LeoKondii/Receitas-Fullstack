export const initialState = {
  recipes: [],
  loading: false,
  error: "",
  selectedRecipe: null,
  searchTerm: "",
};

export function recipeReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: "" };

    case "SET_RECIPES":
      return { ...state, recipes: action.payload, loading: false, error: "" };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false, recipes: [] };

    case "SET_SELECTED_RECIPE":
      return { ...state, selectedRecipe: action.payload };

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "CLEAR_RESULTS":
      return { ...state, recipes: [], error: "", loading: false };

    default:
      return state;
  }
}