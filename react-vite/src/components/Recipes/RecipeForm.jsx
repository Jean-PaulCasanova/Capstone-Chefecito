// src/components/RecipeForm.jsx
import { useState } from "react";

function RecipeForm({ onSubmit, initialData = {} }) {
  // Initialize state with either initialData (for editing) or empty defaults
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [ingredients, setIngredients] = useState(
    initialData.ingredients || [""]
  );
  const [instructions, setInstructions] = useState(initialData.instructions || "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");

  // Add/remove ingredient fields dynamically
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      ingredients: ingredients.filter((ing) => ing.trim() !== ""), // clean empty
      instructions,
      image_url: imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Ingredients</label>
        {ingredients.map((ing, idx) => (
          <div key={idx} style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(idx, e.target.value)}
              required
            />
            <button type="button" onClick={() => removeIngredient(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient}>
          Add Ingredient
        </button>
      </div>

      <div>
        <label>Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <button type="submit">Save Recipe</button>
    </form>
  );
}

export default RecipeForm;