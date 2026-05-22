import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Welcome to Chefecito</p>

          <h1 className="home-hero__title">
            Save recipes, build grocery lists, and cook with ease.
          </h1>

          <p className="home-hero__text">
            Chefecito helps you organize your favorite recipes, turn ingredients
            into grocery list items, and keep your cooking ideas in one place.
          </p>

          <div className="home-hero__actions">
            <Link to="/recipes" className="home-btn home-btn--primary">
              Browse Recipes
            </Link>

            <Link to="/recipes/new" className="home-btn home-btn--secondary">
              Create Recipe
            </Link>
          </div>
        </div>

        <div className="home-hero__card">
          <span className="home-hero__icon">🍳</span>
          <h2>Your digital recipe kitchen</h2>
          <p>
            Plan meals, save ingredients, and keep your cooking workflow simple.
          </p>
        </div>
      </section>

      <section className="home-features">
        <article className="home-feature-card">
          <span>📖</span>
          <h3>Recipe Library</h3>
          <p>Create, edit, and browse recipes with images, descriptions, and instructions.</p>
        </article>

        <article className="home-feature-card">
          <span>🛒</span>
          <h3>Grocery List</h3>
          <p>Add recipe ingredients directly to your grocery list while planning meals.</p>
        </article>

        <article className="home-feature-card">
          <span>💬</span>
          <h3>Social Cooking</h3>
          <p>Like, favorite, and comment on recipes to make cooking more interactive.</p>
        </article>
      </section>
    </main>
  );
}

export default HomePage;