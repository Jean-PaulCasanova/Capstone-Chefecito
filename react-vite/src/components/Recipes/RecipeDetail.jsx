import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchRecipe, deleteExistingRecipe } from "../../redux/recipes";
import { addGroceryItem } from "../../redux/groceryList";
import "./Recipe.css";

// NEW: socials UI
import SocialBar from "./SocialBar";
import CommentsPanel from "./CommentsPanel";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipe = useSelector((state) => state.recipes[recipeId]);
  const sessionUser = useSelector((state) => state.session.user); // NEW

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
    <main className="recipe-detail">
      <header className="recipe-detail__header">
        <div>
          <h1 className="recipe-detail__title">{recipe.title}</h1>
          <SocialBar recipeId={Number(recipeId)} isLoggedIn={!!sessionUser} />
        </div>
      </header>
  
      {recipe.image_url && (
        <img
          className="recipe-detail__image"
          src={recipe.image_url}
          alt={recipe.title}
        />
      )}
  
      {recipe.description && (
        <section className="recipe-detail__section">
          <h2 className="recipe-section-title">Description</h2>
          <p className="recipe-text">{recipe.description}</p>
        </section>
      )}
  
      <div className="recipe-detail__content">
        <section className="recipe-detail__section">
          <div className="recipe-detail__section-header">
            <h2 className="recipe-section-title">Ingredients</h2>
            <Link to="/grocery-list" className="recipe-detail__link">
              View Grocery List →
            </Link>
          </div>
  
          {errorMsg && <p className="recipe-error">{errorMsg}</p>}
  
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
                    {addingIdx === i
                      ? "Adding…"
                      : justAddedIdx === i
                      ? "Added!"
                      : "➕ " + ing}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="recipe-text">No ingredients provided.</p>
          )}
        </section>
  
        <section className="recipe-detail__section">
          <h2 className="recipe-section-title">Instructions</h2>
          <p className="recipe-text recipe-instructions">{recipe.instructions}</p>
        </section>
      </div>
  
      <div className="recipe-detail__actions">
        <button
          type="button"
          className="recipe-action-btn"
          onClick={() => navigate(`/recipes/${recipeId}/edit`)}
        >
          Edit
        </button>
  
        <button
          type="button"
          className="recipe-action-btn recipe-action-btn--danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
  
      <CommentsPanel recipeId={Number(recipeId)} sessionUser={sessionUser} />
    </main>
  );
