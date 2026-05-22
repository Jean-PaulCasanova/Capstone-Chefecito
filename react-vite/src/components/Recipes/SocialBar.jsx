import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes, toggleLike, fetchFavourite, addFavourite, removeFavourite } from "../../redux/socials";

export default function SocialBar({ recipeId, isLoggedIn }) {
  const dispatch = useDispatch();
  const likes = useSelector((s) => s.socials?.likes?.[recipeId]);
  const favs  = useSelector((s) => s.socials?.favourites?.[recipeId]);

  useEffect(() => {
    if (!recipeId) return;
    dispatch(fetchLikes(recipeId));
    dispatch(fetchFavourite(recipeId));
  }, [dispatch, recipeId]);

  const onLike = () => {
    if (!isLoggedIn) return;
    dispatch(toggleLike(recipeId));
  };

  const onFav = () => {
    if (!isLoggedIn) return;
    if (favs?.isFavourited) dispatch(removeFavourite(recipeId));
    else dispatch(addFavourite(recipeId));
  };

  return (
    <div className="social-bar" style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0 16px" }}>
      <button type="button" onClick={onLike} disabled={!isLoggedIn}>
        {likes?.userLiked ? "💙 Unlike" : "🤍 Like"} {likes?.count ?? 0}
      </button>
      <button type="button" onClick={onFav} disabled={!isLoggedIn}>
        {favs?.isFavourited ? "★ Unfavourite" : "☆ Favourite"} {favs?.count ?? 0}
      </button>
      {!isLoggedIn && <small style={{ opacity: 0.7 }}>Log in to like/favourite</small>}
    </div>
  );
}