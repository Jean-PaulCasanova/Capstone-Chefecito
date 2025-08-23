import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul className="nav-list">
      <li>
        <NavLink to="/" exact="true" activeclassname="active">
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/recipes" activeclassname="active">
          Recipes
        </NavLink>
      </li>

      <li>
        <NavLink to="/grocery-list" activeclassname="active">
          Grocery List
        </NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
