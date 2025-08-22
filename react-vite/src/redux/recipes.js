import { csrfFetch } from "./csrf";

// Action Types
const LOAD_RECIPES = "recipes/loadRecipes";
const LOAD_RECIPE = "recipes/loadRecipe";
const CREATE_RECIPE = "recipes/createRecipe";
const UPDATE_RECIPE = "recipes/updateRecipe";
const DELETE_RECIPE = "recipes/deleteRecipe";

// Action Creators
const loadRecipes = (recipes) => ({ type: LOAD_RECIPES, recipes });
const loadRecipe = (recipe) => ({ type: LOAD_RECIPE, recipe });
const createRecipe = (recipe) => ({ type: CREATE_RECIPE, recipe });
const updateRecipe = (recipe) => ({ type: UPDATE_RECIPE, recipe });
const deleteRecipe = (recipeId) => ({ type: DELETE_RECIPE, recipeId });

// Thunks
export const fetchRecipes = (page = 1, perPage = 20) => async (dispatch) => {
  const res = await csrfFetch(`/api/recipes?page=${page}&per_page=${perPage}`);
  if (res.ok) {
    const data = await res.json();
    // Pass only the array to the reducer
    dispatch(loadRecipes(data.recipes));
  }
};

export const fetchRecipe = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/recipes/${id}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadRecipe(data));
  }
};

export const createNewRecipe = (recipeData) => async (dispatch) => {
  const res = await csrfFetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipeData),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(createRecipe(data));
    return data;
  }
};

export const updateExistingRecipe = (id, recipeData) => async (dispatch) => {
  const res = await csrfFetch(`/api/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipeData),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateRecipe(data));
    return data;
  }
};

export const deleteExistingRecipe = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/recipes/${id}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(deleteRecipe(id));
  }
};

// Reducer
const recipesReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_RECIPES: {
      // Accept either an array or an object with { recipes: [] }
      const list = Array.isArray(action.recipes)
        ? action.recipes
        : action.recipes?.recipes || [];

      const newState = {};
      list.forEach((recipe) => {
        newState[recipe.id] = recipe;
      });
      return newState;
    }
    case LOAD_RECIPE:
    case CREATE_RECIPE:
    case UPDATE_RECIPE:
      return { ...state, [action.recipe.id]: action.recipe };
    case DELETE_RECIPE: {
      const newState = { ...state };
      delete newState[action.recipeId];
      return newState;
    }
    default:
      return state;
  }
};

export default recipesReducer;