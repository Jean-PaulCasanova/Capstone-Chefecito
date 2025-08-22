// src/components/GroceryList/GroceryList.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroceries, deleteGrocery } from "../../store/groceryList";

function GroceryList() {
  const items = useSelector((state) => state.groceryList);
  const dispatch = useDispatch();

  // Fetch groceries when component mounts
  useEffect(() => {
    dispatch(fetchGroceries());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteGrocery(id));
  };

  return (
    <div className="grocery-list">
      <h2>My Grocery List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroceryList;