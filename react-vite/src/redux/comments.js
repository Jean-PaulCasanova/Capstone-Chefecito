// src/redux/comments.js
const SET_COMMENTS = "comments/SET_COMMENTS";
const ADD_COMMENT  = "comments/ADD_COMMENT";
const UPDATE_COMMENT = "comments/UPDATE_COMMENT";
const REMOVE_COMMENT = "comments/REMOVE_COMMENT";

const setComments = (recipeId, payload) => ({ type: SET_COMMENTS, recipeId, payload });
const addComment  = (recipeId, comment) => ({ type: ADD_COMMENT, recipeId, comment });
const updateComment = (recipeId, comment) => ({ type: UPDATE_COMMENT, recipeId, comment });
const removeComment = (recipeId, commentId) => ({ type: REMOVE_COMMENT, recipeId, commentId });

export const fetchComments = (recipeId, page = 1, perPage = 10) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/comments?page=${page}&per_page=${perPage}`);
  if (res.ok) dispatch(setComments(recipeId, await res.json()));
};

export const createComment = (recipeId, content) => async (dispatch) => {
  const res = await fetch(`/api/recipes/${recipeId}/comments`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  if (res.ok) dispatch(addComment(recipeId, await res.json()));
  else return res.json(); // for error handling in UI
};

export const editComment = (recipeId, commentId, content) => async (dispatch) => {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: "PUT", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  if (res.ok) dispatch(updateComment(recipeId, await res.json()));
};

export const deleteComment = (recipeId, commentId) => async (dispatch) => {
  const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE", credentials: "include" });
  if (res.ok) dispatch(removeComment(recipeId, commentId));
};

const initial = {
  byRecipe: {
    // [recipeId]: { comments: [], total, pages, current_page }
  }
};

export default function commentsReducer(state = initial, action) {
  switch (action.type) {
    case SET_COMMENTS: {
      const next = { ...state, byRecipe: { ...state.byRecipe } };
      next.byRecipe[action.recipeId] = action.payload;
      return next;
    }
    case ADD_COMMENT: {
      const cur = state.byRecipe[action.recipeId] || { comments: [], total: 0, pages: 1, current_page: 1 };
      return {
        ...state,
        byRecipe: {
          ...state.byRecipe,
          [action.recipeId]: {
            ...cur,
            comments: [action.comment, ...cur.comments],
            total: (cur.total || 0) + 1
          }
        }
      };
    }
    case UPDATE_COMMENT: {
      const cur = state.byRecipe[action.recipeId]; if (!cur) return state;
      return {
        ...state,
        byRecipe: {
          ...state.byRecipe,
          [action.recipeId]: {
            ...cur,
            comments: cur.comments.map(c => c.id === action.comment.id ? action.comment : c)
          }
        }
      };
    }
    case REMOVE_COMMENT: {
      const cur = state.byRecipe[action.recipeId]; if (!cur) return state;
      return {
        ...state,
        byRecipe: {
          ...state.byRecipe,
          [action.recipeId]: {
            ...cur,
            comments: cur.comments.filter(c => c.id !== action.commentId),
            total: Math.max(0, (cur.total || 1) - 1)
          }
        }
      };
    }
    default:
      return state;
  }
}