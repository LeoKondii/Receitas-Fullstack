import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecipe } from "../contexts/RecipeContext";
import "./SearchForm.css";

export default function SearchForm() {
  const { searchRecipes, state } = useRecipe();

  const { register, watch, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: { search: "" },
  });

  const searchValue = watch("search");

  useEffect(() => {
    searchRecipes(searchValue);
  }, [searchValue, searchRecipes]);

  function handleClear() {
    setValue("search", "");
    searchRecipes("");
  }

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-label">O que você quer cozinhar hoje?</div>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Ex: pasta, chicken, soup..."
            className={`search-input ${errors.search ? "search-input--error" : ""}`}
            autoComplete="off"
            {...register("search", {
              minLength: { value: 2, message: "Digite pelo menos 2 letras" },
            })}
          />
          {state.loading && <span className="search-spinner" />}
          {!state.loading && searchValue && searchValue.length > 0 && (
            <button
              className="search-clear"
              onClick={handleClear}
              type="button"
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        {errors.search && (
          <p className="search-hint search-hint--error" role="alert">
            ⚠ {errors.search.message}
          </p>
        )}
        {!errors.search && (!searchValue || searchValue.length === 0) && (
          <p className="search-hint">Digite pelo menos 2 letras para começar a busca</p>
        )}
      </div>
    </section>
  );
}