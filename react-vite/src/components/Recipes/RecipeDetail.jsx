// src/components/Recipes/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchRecipe, deleteExistingRecipe } from "../../redux/recipes";
import { addGroceryItem } from "../../redux/groceryList";
import "./Recipe.css";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipe = useSelector((state) => state.recipes[recipeId]);

  // UI feedback state
  const [addingIdx, setAddingIdx] = useState(null);
  const [justAddedIdx, setJustAddedIdx] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (recipeId) dispatch(fetchRecipe(recipeId));
  }, [dispatch, recipeId]);

  if (!recipe) return <div style={{ padding: 16 }}>Loading recipe…</div>;

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  const handleAddIngredient = async (ingredient, idx) => {
    setErrorMsg("");
    setAddingIdx(idx);
    try {
      await dispatch(addGroceryItem({ item_name: ingredient }));
      setJustAddedIdx(idx);
      // reset the “Added!” indicator after a moment
      setTimeout(() => setJustAddedIdx(null), 900);
    } catch (e) {
      setErrorMsg("Could not add to grocery list. Please try again.");
    } finally {
      setAddingIdx(null);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteExistingRecipe(recipeId));
    navigate("/recipes");
  };

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>

      {recipe.image_url ? (
        <div className="recipe-card__image" style={{ maxWidth: 680 }}>
          <img src={recipe.image_url} alt={recipe.title} />
        </div>
      ) : null}

      {recipe.description && (
        <>
          <h3>Description</h3>
          <p>{recipe.description}</p>
        </>
      )}

      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h3>Ingredients</h3>
        <Link to="/grocery-list" className="btn">View Grocery List →</Link>
      </div>

      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      {ingredients.length ? (
        <ul className="ingredients-list">
          {ingredients.map((ing, i) => (
            <li key={`${i}-${ing}`}>
              <button
                type="button"
                className="ingredient-btn"
                onClick={() => handleAddIngredient(ing, i)}
                disabled={addingIdx === i}
                title="Add to Grocery List"
              >
                {addingIdx === i ? "Adding…" : justAddedIdx === i ? "Added!" : "➕ " + ing}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients provided.</p>
      )}

      <h3>Instructions</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</p>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button type="button" onClick={() => navigate(`/recipes/${recipeId}/edit`)}>
          Edit
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
