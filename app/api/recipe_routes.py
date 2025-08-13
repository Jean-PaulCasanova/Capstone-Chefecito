from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Recipe, User
from datetime import datetime

recipe_routes = Blueprint('recipes', __name__)

# GET /api/recipes - Get all recipes
@recipe_routes.route('/', methods=['GET'])
def get_all_recipes():
    """
    Get all recipes with optional pagination
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        recipes = Recipe.query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'recipes': [recipe.to_dict() for recipe in recipes.items],
            'total': recipes.total,
            'pages': recipes.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch recipes'}), 500


# GET /api/recipes/<id> - Get single recipe by ID
@recipe_routes.route('/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """
    Get a single recipe by ID
    """
    recipe = Recipe.query.get(recipe_id)
    
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    
    return jsonify(recipe.to_dict()), 200


# POST /api/recipes - Create new recipe
@recipe_routes.route('/', methods=['POST'])
@login_required
def create_recipe():
    """
    Create a new recipe (requires authentication)
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'ingredients', 'instructions']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate ingredients is a list
        if not isinstance(data.get('ingredients'), list):
            return jsonify({'error': 'ingredients must be an array'}), 400
        
        # Create new recipe
        new_recipe = Recipe(
            title=data['title'],
            description=data.get('description', ''),
            ingredients=data['ingredients'],
            instructions=data['instructions'],
            image_url=data.get('image_url', ''),
            user_id=current_user.id
        )
        
        db.session.add(new_recipe)
        db.session.commit()
        
        return jsonify(new_recipe.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create recipe'}), 500


# PUT /api/recipes/<id> - Update recipe
@recipe_routes.route('/<int:recipe_id>', methods=['PUT'])
@login_required
def update_recipe(recipe_id):
    """
    Update a recipe (only owner can update)
    """
    try:
        recipe = Recipe.query.get(recipe_id)
        
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404
        
        # Check if current user owns the recipe
        if recipe.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized - you can only edit your own recipes'}), 403
        
        data = request.get_json()
        
        # Validate ingredients if provided
        if 'ingredients' in data and not isinstance(data['ingredients'], list):
            return jsonify({'error': 'ingredients must be an array'}), 400
        
        # Update fields if provided
        if 'title' in data:
            recipe.title = data['title']
        if 'description' in data:
            recipe.description = data['description']
        if 'ingredients' in data:
            recipe.ingredients = data['ingredients']
        if 'instructions' in data:
            recipe.instructions = data['instructions']
        if 'image_url' in data:
            recipe.image_url = data['image_url']
        
        # Update the updated_at timestamp
        recipe.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(recipe.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update recipe'}), 500


# DELETE /api/recipes/<id> - Delete recipe
@recipe_routes.route('/<int:recipe_id>', methods=['DELETE'])
@login_required
def delete_recipe(recipe_id):
    """
    Delete a recipe (only owner can delete)
    """
    try:
        recipe = Recipe.query.get(recipe_id)
        
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404
        
        # Check if current user owns the recipe
        if recipe.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized - you can only delete your own recipes'}), 403
        
        db.session.delete(recipe)
        db.session.commit()
        
        return jsonify({'message': 'Recipe deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete recipe'}), 500


# GET /api/recipes/user/<user_id> - Get recipes by user
@recipe_routes.route('/user/<int:user_id>', methods=['GET'])
def get_recipes_by_user(user_id):
    """
    Get all recipes created by a specific user
    """
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        recipes = Recipe.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'recipes': [recipe.to_dict() for recipe in recipes],
            'user': user.username,
            'total': len(recipes)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user recipes'}), 500


# GET /api/recipes/my-recipes - Get current user's recipes
@recipe_routes.route('/my-recipes', methods=['GET'])
@login_required
def get_my_recipes():
    """
    Get all recipes created by the current user
    """
    try:
        recipes = Recipe.query.filter_by(user_id=current_user.id).all()
        
        return jsonify({
            'recipes': [recipe.to_dict() for recipe in recipes],
            'total': len(recipes)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch your recipes'}), 500