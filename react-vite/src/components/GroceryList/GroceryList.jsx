import { useSelector } from "react-redux";

function GroceryList() {
  const items = useSelector((state) => state.groceryList);

  return (
    <div className="grocery-list">
      <h2>My Grocery List</h2>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroceryList;