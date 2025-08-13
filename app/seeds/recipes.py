from app.models import db, Recipe, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_recipes():
    # Get users to reference
    demo = User.query.filter_by(username='Demo').first()
    marnie = User.query.filter_by(username='marnie').first()
    bobbie = User.query.filter_by(username='bobbie').first()
    
    # Recipe 1: The Juice (Demo's recipe)
    the_juice = Recipe(
        title="The Juice",
        description="Refreshing and packed with vitamins and nutrients, this juice recipe is an excellent addition to any breakfast or lunch!",
        ingredients=["Apples", "Beets", "Carrots", "Celery", "Turmeric", "Apple Cider Vinegar"],
        instructions="Wash and prepare your fruits and veggies to be juiced. Add a teaspoon of turmeric powder and a couple table spoons of Apple Cider Vinegar to the vessel in which you will be collecting the juice. Once all of your fruits and veggies have been passed through the juicer, stir in about a pint of ice cubes to dilute and serve!",
        image_url="https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
        user_id=demo.id
    )
    
    # Recipe 2: Thin and Crispy Pizza Dough (Marnie's recipe)
    thin_crispy_pizza_dough = Recipe(
        title="Thin and Crispy Pizza Dough",
        description="Excellent pizza dough ready to bake in as soon as 2 hours",
        ingredients=["All Purpose Flour", "Instant Yeast", "Salt", "Sugar", "Olive Oil", "Water"],
        instructions="In the bowl of a food processor or stand mixer add 1 & 3/4 Cup of Flour, teaspoon of Yeast, tablespoon of Sugar and pulse to incorporate dry ingredients, then add 1 tablespoon of Olive Oil, and half a tablespoon of Salt and with the processor/mixer on a low-medium setting trickle in about half a cup of Cold Water until a tacky dough starts to form. Knead by hand for 10min, then in an oiled bowl, cover and let rest for 2 hours before rolling out. Bakes for 15-20 minutes at 420°F degrees.",
        image_url="https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg",
        user_id=marnie.id
    )
    
    # Recipe 3: Sofrito (Bobbie's recipe)
    sofrito = Recipe(
        title="Sofrito",
        description="Traditional zesty and savory cooking base, use it in your beans, as a marinade, as a dipping sauce or even as a salad dressing - guaranteed to give any meal that special touch!",
        ingredients=["Garlic", "Bell Pepper", "Onion", "Celery", "Cilantro", "Culantro", "Oregano", "Salt", "Pepper", "Cumin", "Olive Oil", "Vinegar"],
        instructions="In a food processor/blender add: 5 cloves of garlic, half a cup of cilantro, culantro, 1 bell pepper, 1 whole medium onion, celery, oregano, cumin, olive oil, vinegar, salt and pepper to taste. Blend until you achieve your desired consistency.",
        image_url="https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg",
        user_id=bobbie.id
    )
    
    # Add all recipes to the session
    db.session.add(the_juice)
    db.session.add(thin_crispy_pizza_dough)
    db.session.add(sofrito)
    
    # Commit all changes
    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))
        
    db.session.commit()