// src/redux/socials.js
const SET_LIKE_STATE = "socials/SET_LIKE_STATE";
const SET_FAV_STATE  = "socials/SET_FAV_STATE";

const setLikeState = (recipeId, { userLiked, count }) => ({ type: SET_LIKE_STATE, recipeId, userLiked, count });
const setFavState  = (recipeId, { isFavourited, count }) => ({ type: SET_FAV_STATE,  recipeId, isFavourited, count });

export const fetchLikes = (recipeId) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/likes`, { credentials: "include" });
  if (res.ok) {
    const data = await res.json();
    dispatch(setLikeState(recipeId, { userLiked: data.userLiked, count: data.count }));
  }
};

export const toggleLike = (recipeId) => async (dispatch, getState) => {
  // optimistic UI
  const prev = getState().socials.likes[recipeId] || { userLiked: false, count: 0 };
  const optimistic = { userLiked: !prev.userLiked, count: prev.userLiked ? prev.count - 1 : prev.count + 1 };
  dispatch(setLikeState(recipeId, optimistic));

  const res = await fetch(`/api/recipes/${recipeId}/likes/toggle`, {
    method: "POST", credentials: "include"
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(setLikeState(recipeId, { userLiked: data.liked, count: data.count }));
  } else {
    // revert on failure
    dispatch(setLikeState(recipeId, prev));
  }
};

export const fetchFavourite = (recipeId) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/favourites`, { credentials: "include" });
  if (res.ok) {
    const data = await res.json();
    dispatch(setFavState(recipeId, { isFavourited: data.isFavourited, count: data.count }));
  }
};

export const addFavourite = (recipeId) => async (dispatch, getState) => {
  const prev = getState().socials.favourites[recipeId] || { isFavourited: false, count: 0 };
  const optimistic = { isFavourited: true, count: prev.count + 1 };
  dispatch(setFavState(recipeId, optimistic));

  const res = await fetch(`/api/recipes/${recipeId}/favourites`, {
    method: "POST", credentials: "include"
  });
  if (!res.ok) dispatch(setFavState(recipeId, prev));
};

export const removeFavourite = (recipeId) => async (dispatch, getState) => {
  const prev = getState().socials.favourites[recipeId] || { isFavourited: false, count: 0 };
  const optimistic = { isFavourited: false, count: Math.max(0, prev.count - 1) };
  dispatch(setFavState(recipeId, optimistic));

  const res = await fetch(`/api/recipes/${recipeId}/favourites`, {
    method: "DELETE", credentials: "include"
  });
  if (!res.ok) dispatch(setFavState(recipeId, prev));
};

const initial = { likes: {}, favourites: {} };

export default function socialsReducer(state = initial, action) {
  switch (action.type) {
    case SET_LIKE_STATE: {
      const next = { ...state, likes: { ...state.likes } };
      next.likes[action.recipeId] = { userLiked: action.userLiked, count: action.count };
      return next;
    }
    case SET_FAV_STATE: {
      const next = { ...state, favourites: { ...state.favourites } };
      next.favourites[action.recipeId] = { isFavourited: action.isFavourited, count: action.count };
      return next;
    }
    default:
      return state;
  }
}