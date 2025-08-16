from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, GroceryList, GroceryListItem, Recipe
from datetime import datetime

grocery_list_routes = Blueprint('grocery_lists', __name__)

# GET /api/grocery-lists - Get all grocery lists for current user
@grocery_list_routes.route('/', methods=['GET'])
@login_required
def get_user_grocery_lists():
    """
    Get all grocery lists for the current user
    """
    try:
        grocery_lists = GroceryList.query.filter_by(user_id=current_user.id).all()
        
        return jsonify({
            'grocery_lists': [grocery_list.to_dict() for grocery_list in grocery_lists],
            'total': len(grocery_lists)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch grocery lists'}), 500


# GET /api/grocery-lists/<id> - Get single grocery list by ID
@grocery_list_routes.route('/<int:list_id>', methods=['GET'])
@login_required
def get_grocery_list(list_id):
    """
    Get a single grocery list by ID (owner only)
    """
    grocery_list = GroceryList.query.get(list_id)
    
    if not grocery_list:
        return jsonify({'error': 'Grocery list not found'}), 404
    
    # Check if current user owns the list
    if grocery_list.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized - you can only view your own grocery lists'}), 403
    
    return jsonify(grocery_list.to_dict()), 200


# POST /api/grocery-lists - Create new grocery list
@grocery_list_routes.route('/', methods=['POST'])
@login_required
def create_grocery_list():
    """
    Create a new grocery list
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'name is required'}), 400
        
        # Create new grocery list
        new_list = GroceryList(
            name=data['name'],
            user_id=current_user.id
        )
        
        db.session.add(new_list)
        db.session.commit()
        
        return jsonify(new_list.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create grocery list'}), 500


# PUT /api/grocery-lists/<id> - Update grocery list name
@grocery_list_routes.route('/<int:list_id>', methods=['PUT'])
@login_required
def update_grocery_list(list_id):
    """
    Update a grocery list (owner only)
    """
    try:
        grocery_list = GroceryList.query.get(list_id)
        
        if not grocery_list:
            return jsonify({'error': 'Grocery list not found'}), 404
        
        # Check if current user owns the list
        if grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized - you can only edit your own grocery lists'}), 403
        
        data = request.get_json()
        
        # Update name if provided
        if 'name' in data:
            grocery_list.name = data['name']
        
        grocery_list.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(grocery_list.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update grocery list'}), 500


# DELETE /api/grocery-lists/<id> - Delete grocery list
@grocery_list_routes.route('/<int:list_id>', methods=['DELETE'])
@login_required
def delete_grocery_list(list_id):
    """
    Delete a grocery list (owner only) - cascade deletes all items
    """
    try:
        grocery_list = GroceryList.query.get(list_id)
        
        if not grocery_list:
            return jsonify({'error': 'Grocery list not found'}), 404
        
        # Check if current user owns the list
        if grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized - you can only delete your own grocery lists'}), 403
        
        db.session.delete(grocery_list)
        db.session.commit()
        
        return jsonify({'message': 'Grocery list deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete grocery list'}), 500


# POST /api/grocery-lists/<id>/items - Add item to grocery list
@grocery_list_routes.route('/<int:list_id>/items', methods=['POST'])
@login_required
def add_item_to_list(list_id):
    """
    Add an item to a grocery list
    """
    try:
        grocery_list = GroceryList.query.get(list_id)
        
        if not grocery_list:
            return jsonify({'error': 'Grocery list not found'}), 404
        
        # Check if current user owns the list
        if grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if not data.get('item_name'):
            return jsonify({'error': 'item_name is required'}), 400
        
        # Create new grocery list item
        new_item = GroceryListItem(
            grocery_list_id=list_id,
            item_name=data['item_name'],
            quantity=data.get('quantity', ''),
            notes=data.get('notes', ''),
            checked_off=data.get('checked_off', False)
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify(new_item.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item to grocery list'}), 500


# PUT /api/grocery-lists/items/<item_id> - Update grocery list item
@grocery_list_routes.route('/items/<int:item_id>', methods=['PUT'])
@login_required
def update_grocery_item(item_id):
    """
    Update a grocery list item (owner only)
    """
    try:
        item = GroceryListItem.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Grocery list item not found'}), 404
        
        # Check if current user owns the parent list
        if item.grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Update fields if provided
        if 'item_name' in data:
            item.item_name = data['item_name']
        if 'quantity' in data:
            item.quantity = data['quantity']
        if 'notes' in data:
            item.notes = data['notes']
        if 'checked_off' in data:
            item.checked_off = data['checked_off']
        
        db.session.commit()
        
        return jsonify(item.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update grocery list item'}), 500


# DELETE /api/grocery-lists/items/<item_id> - Delete grocery list item
@grocery_list_routes.route('/items/<int:item_id>', methods=['DELETE'])
@login_required
def delete_grocery_item(item_id):
    """
    Delete a grocery list item (owner only)
    """
    try:
        item = GroceryListItem.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Grocery list item not found'}), 404
        
        # Check if current user owns the parent list
        if item.grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Grocery list item deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete grocery list item'}), 500


# POST /api/grocery-lists/<id>/add-recipe-ingredients - Add recipe ingredients to list
@grocery_list_routes.route('/<int:list_id>/add-recipe-ingredients', methods=['POST'])
@login_required
def add_recipe_ingredients_to_list(list_id):
    """
    Add all ingredients from a recipe to a grocery list
    """
    try:
        grocery_list = GroceryList.query.get(list_id)
        
        if not grocery_list:
            return jsonify({'error': 'Grocery list not found'}), 404
        
        # Check if current user owns the list
        if grocery_list.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        recipe_id = data.get('recipe_id')
        
        if not recipe_id:
            return jsonify({'error': 'recipe_id is required'}), 400
        
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Recipe not found'}), 404
        
        # Add each ingredient as a grocery list item
        added_items = []
        for ingredient in recipe.ingredients:
            new_item = GroceryListItem(
                grocery_list_id=list_id,
                item_name=ingredient,
                quantity=data.get('quantity', ''),  # Optional default quantity
                notes=f"From recipe: {recipe.title}"
            )
            db.session.add(new_item)
            added_items.append(new_item)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Added {len(added_items)} ingredients from {recipe.title}',
            'items': [item.to_dict() for item in added_items]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add recipe ingredients'}), 500