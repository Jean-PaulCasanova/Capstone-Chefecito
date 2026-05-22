// src/components/Recipes/RecipesList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchRecipes } from "../../redux/recipes";
import "./Recipe.css"; // optional if you want to style cards

export default function RecipesList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const recipes = useSelector((state) => Object.values(state.recipes)); // normalized -> array

  useEffect(() => {
    (async () => {
      await dispatch(fetchRecipes());
      setLoading(false);
    })();
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading recipes…</div>;
  }

  if (!recipes.length) {
    return (
      <div style={{ padding: 16 }}>
        <h2>No recipes yet</h2>
        <p>Why not create your first one?</p>
        <Link to="/recipes/new" className="new-recipe-btn">
          + New Recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="recipes-list">
      <div className="recipes-list__header">
        <h1>Recipes</h1>
        <Link to="/recipes/new" className="new-recipe-btn">
          + New Recipe
        </Link>
      </div>

      <div className="recipes-grid">
        {recipes.map((r) => (
          <Link key={r.id} to={`/recipes/${r.id}`} className="recipe-card">
            <div className="recipe-card__image">
              {r.image_url ? (
                <img src={r.image_url} alt={r.title} />
              ) : (
                <div className="recipe-card__placeholder">No Image</div>
              )}
            </div>
            <div className="recipe-card__body">
              <h3 className="recipe-card__title">{r.title}</h3>
              {r.description && (
                <p className="recipe-card__desc">
                  {r.description.length > 120
                    ? r.description.slice(0, 120) + "…"
                    : r.description}
                </p>
              )}
              <div className="recipe-card__meta">
                {r.username ? `by ${r.username}` : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}