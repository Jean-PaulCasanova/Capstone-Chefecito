import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';

// new components
import RecipeDetail from '../components/RecipeDetail';
import GroceryListPage from '../components/GroceryListPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "recipes/:recipeId",  
        element: <RecipeDetail />,
      },
      {
        path: "grocery-list",  
        element: <GroceryListPage />,
      },
    ],
  },
]);