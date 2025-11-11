import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes, toggleLike, fetchFavourite, addFavourite, removeFavourite } from "../redux/socials";

export default function RecipeHeader({ recipe }) {
  const dispatch = useDispatch();
  const likes = useSelector(s => s.socials.likes[recipe.id]);
  const favs  = useSelector(s => s.socials.favourites[recipe.id]);

  useEffect(() => {
    dispatch(fetchLikes(recipe.id));
    dispatch(fetchFavourite(recipe.id));
  }, [dispatch, recipe.id]);

  const onToggleLike = () => dispatch(toggleLike(recipe.id));
  const onToggleFav  = () => {
    if (favs?.isFavourited) dispatch(removeFavourite(recipe.id));
    else dispatch(addFavourite(recipe.id));
  };

  return (
    <div className="recipe-header">
      <h1>{recipe.title}</h1>
      <div className="actions">
        <button onClick={onToggleLike}>
          {likes?.userLiked ? "💙 Unlike" : "🤍 Like"} {likes?.count ?? 0}
        </button>
        <button onClick={onToggleFav}>
          {favs?.isFavourited ? "★ Unfavourite" : "☆ Favourite"} {favs?.count ?? 0}
        </button>
      </div>
    </div>
  );
}