import { csrfFetch } from "./csrf";

// Action Types
const LOAD_ITEMS = "groceryList/loadItems";
const ADD_ITEM = "groceryList/addItem";
const REMOVE_ITEM = "groceryList/removeItem";
const DELETE_LIST = "groceryList/deleteList";

// Action Creators
const loadItems = (items) => ({ type: LOAD_ITEMS, items });
const addItem = (item) => ({ type: ADD_ITEM, item });
const removeItem = (itemId) => ({ type: REMOVE_ITEM, itemId });
const deleteList = (listId) => ({ type: DELETE_LIST, listId });

// Thunks

// Load all grocery list items
export const fetchGroceryList = () => async (dispatch) => {
  const res = await csrfFetch("/api/grocerylist");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadItems(data));
  }
};

// Add a grocery list item
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

// Remove a single grocery list item
export const removeGroceryItem = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/grocerylist/${id}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(removeItem(id));
  }
};

// 🔥 Delete a full grocery list
export const deleteGroceryList = (listId) => async (dispatch) => {
  const res = await csrfFetch(`/api/grocerylist/${listId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteList(listId));
    return true;
  } else {
    const error = await res.json();
    return error;
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
    case DELETE_LIST: {
      const newState = { ...state };
      delete newState[action.listId];
      return newState;
    }
    default:
      return state;
  }
};

export default groceryListReducer;