// src/redux/groceryList.js
import { csrfFetch } from "./csrf";

// Action Types
const LOAD_ITEMS = "groceryList/loadItems";
const ADD_ITEM = "groceryList/addItem";
const REMOVE_ITEM = "groceryList/removeItem";

// Action Creators
const loadItems = (items) => ({ type: LOAD_ITEMS, items });
const addItem = (item) => ({ type: ADD_ITEM, item });
const removeItem = (itemId) => ({ type: REMOVE_ITEM, itemId });

/**
 * Helper: ensure a "Default" grocery list exists, return its id.
 * Uses /api/grocery-lists/ (plural + hyphen) per your backend.
 * NOTE: This is a plain async function (not a thunk) to avoid ESLint "unused dispatch".
 */
const getOrCreateDefaultListId = async () => {
  // 1) Fetch all lists
  const resLists = await csrfFetch("/api/grocery-lists/");
  if (!resLists.ok) {
    const err = await resLists.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch grocery lists.");
  }
  const listsPayload = await resLists.json(); // { grocery_lists: [...], total }
  const lists = listsPayload?.grocery_lists || [];

  // 2) Find "Default"
  let defaultList = lists.find((l) => l.name === "Default");

  // 3) Create if missing
  if (!defaultList) {
    const resCreate = await csrfFetch("/api/grocery-lists/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Default" }),
    });
    if (!resCreate.ok) {
      const err = await resCreate.json().catch(() => ({}));
      throw new Error(err?.error || "Failed to create Default grocery list.");
    }
    defaultList = await resCreate.json(); // created list object
  }

  return defaultList.id;
};

// Thunks

/**
 * Load all items from the user's "Default" grocery list into a flat map.
 * (Keeps your current state shape the same.)
 */
export const fetchGroceryList = () => async (dispatch) => {
  const defaultListId = await getOrCreateDefaultListId();

  const res = await csrfFetch(`/api/grocery-lists/${defaultListId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch grocery list.");
  }

  const list = await res.json(); // { id, name, items: [...] }
  const items = Array.isArray(list.items) ? list.items : [];
  dispatch(loadItems(items));
  return items;
};

/**
 * Add one item (e.g., from clicking an ingredient) to the Default list.
 * itemData shape: { item_name: "2 eggs", quantity?, notes?, checked_off? }
 */
export const addGroceryItem = (itemData) => async (dispatch) => {
  const defaultListId = await getOrCreateDefaultListId();

  const res = await csrfFetch(`/api/grocery-lists/${defaultListId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to add grocery item.");
  }

  const data = await res.json(); // newly created item
  dispatch(addItem(data));
  return data;
};

/**
 * Remove a single item by item id.
 * Backend route: DELETE /api/grocery-lists/items/:item_id
 */
export const removeGroceryItem = (itemId) => async (dispatch) => {
  const res = await csrfFetch(`/api/grocery-lists/items/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to delete grocery item.");
  }
  dispatch(removeItem(itemId));
};

// Reducer: flat map { [itemId]: item }
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