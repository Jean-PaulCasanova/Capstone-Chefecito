import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const getNavClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        Chefecito
      </NavLink>

      <ul className="nav-list">
        <li>
          <NavLink to="/" className={getNavClass}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/recipes" className={getNavClass}>
            Recipes
          </NavLink>
        </li>

        <li>
          <NavLink to="/grocery-list" className={getNavClass}>
            Grocery List
          </NavLink>
        </li>

        <li className="nav-profile">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
