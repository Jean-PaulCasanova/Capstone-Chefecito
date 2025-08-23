// src/components/GroceryList/GroceryList.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroceryList, removeGroceryItem } from "../../redux/groceryList";
import { Link } from "react-router-dom";

export default function GroceryList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Flat map -> array
  const items = useSelector((state) => Object.values(state.groceryList));

  useEffect(() => {
    (async () => {
      await dispatch(fetchGroceryList()); // loads items from the Default list
      setLoading(false);
    })();
  }, [dispatch]);

  const handleDeleteItem = (itemId) => {
    dispatch(removeGroceryItem(itemId));
  };

  if (loading) return <div style={{ padding: 16 }}>Loading your grocery list…</div>;

  return (
    <div className="grocery-list" style={{ padding: 16 }}>
      <h2>My Grocery List (Default)</h2>

      {!items.length ? (
        <div>
          <p>No items yet. Head to a recipe and click an ingredient to add it.</p>
          <Link to="/recipes" className="btn">Browse Recipes →</Link>
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ margin: "6px 0" }}>
              {item.item_name}
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}