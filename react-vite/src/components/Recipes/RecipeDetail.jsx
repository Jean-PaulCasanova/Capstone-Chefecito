import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipe, deleteExistingRecipe } from "../../redux/recipes"; // adjust path if needed

function RecipeDetail() {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipe = useSelector((state) => state.recipes[recipeId]);

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchRecipe(recipeId));
    }
  }, [dispatch, recipeId]);

  if (!recipe) return <p>Loading recipe...</p>;

  const handleDelete = async () => {
    await dispatch(deleteExistingRecipe(recipeId));
    navigate("/"); // go back home after delete
  };

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.instructions}</p>

      {recipe.Ingredients && recipe.Ingredients.length > 0 && (
        <ul>
          {recipe.Ingredients.map((ing) => (
            <li key={ing.id}>
              {ing.quantity} {ing.name}
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleDelete}>Delete Recipe</button>
    </div>
  );
}

export default RecipeDetail;
