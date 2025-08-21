import { csrfFetch } from "./csrf";

// Action Types
const LOAD_ITEMS = "groceryList/loadItems";
const ADD_ITEM = "groceryList/addItem";
const REMOVE_ITEM = "groceryList/removeItem";

// Action Creators
const loadItems = (items) => ({ type: LOAD_ITEMS, items });
const addItem = (item) => ({ type: ADD_ITEM, item });
const removeItem = (itemId) => ({ type: REMOVE_ITEM, itemId });

// Thunks
export const fetchGroceryList = () => async (dispatch) => {
  const res = await csrfFetch("/api/grocerylist");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadItems(data));
  }
};

export const addGroceryItem = (itemData) => async (dispatch) => {
  const res = await csrfFetch("/api/grocerylist", {
    method: "POST",
    body: JSON.stringify(itemData),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addItem(data));
    return data;
  }
};

export const removeGroceryItem = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/grocerylist/${id}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(removeItem(id));
  }
};

// Reducer
const groceryListReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_ITEMS: {
      const newState = {};
      action.items.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    }
    case ADD_ITEM:
      return { ...state, [action.item.id]: action.item };
    case REMOVE_ITEM: {
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    }
    default:
      return state;
  }
};

export default groceryListReducer;