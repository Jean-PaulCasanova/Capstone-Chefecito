// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

// Auth
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";

// Recipes
import RecipesList from "../components/Recipes/RecipesList";
import RecipeDetail from "../components/Recipes/RecipeDetail";
import RecipeForm from "../components/Recipes/RecipeForm";

// Grocery
import GroceryList from "../components/GroceryList/GroceryList";

// New import
import NotFound from "../components/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <RecipesList /> },
      { path: "login", element: <LoginFormPage /> },
      { path: "signup", element: <SignupFormPage /> },

      { path: "recipes", element: <RecipesList /> },
      { path: "recipes/new", element: <RecipeForm /> },
      { path: "recipes/:recipeId", element: <RecipeDetail /> },
      { path: "recipes/:recipeId/edit", element: <RecipeForm /> },

      { path: "grocery-list", element: <GroceryList /> },
    ],
  },
]);