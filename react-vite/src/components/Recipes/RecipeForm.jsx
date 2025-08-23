// src/components/Recipes/RecipeForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchRecipe,
  createNewRecipe,
  updateExistingRecipe,
} from "../../redux/recipes";
import "./Recipe.css";

export default function RecipeForm() {
  const { recipeId } = useParams(); // if present -> edit mode
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editing = Boolean(recipeId);
  const existing = useSelector((s) => (editing ? s.recipes[recipeId] : null));

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientsText, setIngredientsText] = useState(""); // textarea, one per line
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // load recipe when editing
  useEffect(() => {
    if (editing) dispatch(fetchRecipe(recipeId));
  }, [dispatch, editing, recipeId]);

  // populate form when existing is available
  useEffect(() => {
    if (existing) {
      setTitle(existing.title || "");
      setDescription(existing.description || "");
      setIngredientsText(Array.isArray(existing.ingredients) ? existing.ingredients.join("\n") : "");
      setInstructions(existing.instructions || "");
      setImageUrl(existing.image_url || "");
    }
  }, [existing]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!instructions.trim()) e.instructions = "Instructions are required.";
    // ingredients can be empty if you want, otherwise:
    if (!ingredientsText.trim()) e.ingredients = "At least one ingredient is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setSubmitting(true);

    // convert textarea -> array of strings
    const ingredients = ingredientsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      ingredients,
      instructions: instructions.trim(),
      image_url: imageUrl.trim() || undefined,
    };

    try {
      if (editing) {
        const updated = await dispatch(updateExistingRecipe(Number(recipeId), payload));
        navigate(`/recipes/${updated.id}`);
      } else {
        const created = await dispatch(createNewRecipe(payload));
        navigate(`/recipes/${created.id}`);
      }
    } catch (err) {
      // if csrfFetch threw, surface a readable error
      const message = err?.body?.error || err?.message || "Something went wrong.";
      setErrors((prev) => ({ ...prev, server: message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recipe-form-wrap" style={{ padding: 16, maxWidth: 720 }}>
      <h1>{editing ? "Edit Recipe" : "Create Recipe"}</h1>

      {errors.server && (
        <p style={{ color: "crimson", marginTop: 4 }}>{errors.server}</p>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Grandma’s Lasagna"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A cozy, cheesy classic."
            rows={3}
          />
        </label>

        <label>
          Ingredients (one per line)
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={"2 cups flour\n1 tsp salt\n3 eggs"}
            rows={6}
          />
          {errors.ingredients && (
            <span className="field-error">{errors.ingredients}</span>
          )}
        </label>

        <label>
          Instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1) Preheat oven to 375°F…"
            rows={8}
          />
          {errors.instructions && (
            <span className="field-error">{errors.instructions}</span>
          )}
        </label>

        <label>
          Image URL (optional)
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? (editing ? "Saving…" : "Creating…") : editing ? "Save Changes" : "Create Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}