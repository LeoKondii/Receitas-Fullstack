import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../services/api";
import "./AddRecipeForm.css";

const TAGS = [
  "vegetariana",
  "bife",
  "frango",
  "acompanhamento",
  "sobremesa",
  "frutos do mar",
  "vegana",
  "massa",
  "sopa",
  "salada",
  "café da manhã",
  "bebida",
  "apimentado",
];

export default function AddRecipeForm({ onClose, onSuccess }) {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ingredients: [{ name: "", measure: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  async function onSubmit(data) {
    setServerError("");
    setLoading(true);
    try {
      await api.post("/recipes", data);
      onSuccess();
      onClose();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setServerError(errors.map((e) => e.msg).join(", "));
      } else {
        setServerError(err.response?.data?.error || "Erro ao salvar receita.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-recipe-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="add-recipe-panel">
        <div className="add-recipe-header">
          <h2>Nova Receita</h2>
          <button className="add-recipe-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-recipe-form">

          <div className="add-recipe-field">
            <label>Nome da receita</label>
            <input
              type="text"
              placeholder="Ex: Frango ao curry"
              {...register("name", { required: "Nome é obrigatório" })}
            />
            {errors.name && <span className="add-recipe-error">{errors.name.message}</span>}
          </div>

          <div className="add-recipe-row">
            <div className="add-recipe-field">
              <label>Categoria</label>
              <input
                type="text"
                placeholder="Ex: Chicken"
                {...register("category", { required: "Categoria é obrigatória" })}
              />
              {errors.category && <span className="add-recipe-error">{errors.category.message}</span>}
            </div>

            <div className="add-recipe-field">
              <label>País de origem</label>
              <input
                type="text"
                placeholder="Ex: Brazilian"
                {...register("area", { required: "País é obrigatório" })}
              />
              {errors.area && <span className="add-recipe-error">{errors.area.message}</span>}
            </div>
          </div>

          <div className="add-recipe-field">
            <label>Tag</label>
            <select {...register("tag", { required: "Tag é obrigatória" })}>
              <option value="">Selecione uma tag</option>
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {errors.tag && <span className="add-recipe-error">{errors.tag.message}</span>}
          </div>

          <div className="add-recipe-field">
            <label>Ingredientes</label>
            {fields.map((field, index) => (
              <div key={field.id} className="add-recipe-ingredient-row">
                <input
                  type="text"
                  placeholder="Ingrediente"
                  {...register(`ingredients.${index}.name`, { required: true })}
                />
                <input
                  type="text"
                  placeholder="Medida"
                  {...register(`ingredients.${index}.measure`, { required: true })}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="add-recipe-remove-ing"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-recipe-add-ing"
              onClick={() => append({ name: "", measure: "" })}
            >
              + Adicionar ingrediente
            </button>
          </div>

          <div className="add-recipe-field">
            <label>Modo de preparo</label>
            <textarea
              rows={5}
              placeholder="Descreva o modo de preparo..."
              {...register("instructions", { required: "Modo de preparo é obrigatório" })}
            />
            {errors.instructions && <span className="add-recipe-error">{errors.instructions.message}</span>}
          </div>

          <div className="add-recipe-field">
            <label>Link do YouTube <span className="add-recipe-optional">(opcional)</span></label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("youtubeLink")}
            />
            {errors.youtubeLink && <span className="add-recipe-error">{errors.youtubeLink.message}</span>}
          </div>

          {serverError && <p className="add-recipe-server-error">{serverError}</p>}

          <div className="add-recipe-actions">
            <button type="button" className="add-recipe-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="add-recipe-submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar receita"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
