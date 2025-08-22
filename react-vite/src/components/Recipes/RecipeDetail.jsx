// RecipeDetail.jsx
import { useDispatch } from "react-redux";
import { addItem } from "../../store/groceryList"; // slice action

function RecipeDetail({ recipe }) {
  const dispatch = useDispatch();

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, idx) => (
          <li key={idx}>
            <button
              onClick={() => dispatch(addItem(ingredient))}
              className="ingredient-btn"
            >
              {ingredient}
            </button>
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetail;
