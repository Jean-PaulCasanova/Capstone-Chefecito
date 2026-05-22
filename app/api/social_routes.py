# app/api/social_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Recipe
from app.models.social import Favourite, Like, Comment

social_routes = Blueprint("socials", __name__, url_prefix="/api")

def _recipe_or_404(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return None, (jsonify({"message": "Recipe not found"}), 404)
    return recipe, None

# ---------- FAVOURITES ----------
@social_routes.route("/recipes/<int:recipe_id>/favourites", methods=["POST"])
@login_required
def add_favourite(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    exists = Favourite.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
    if exists:
        return jsonify({"message": "Already favourited"}), 200
    fav = Favourite(user_id=current_user.id, recipe_id=recipe_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({"message": "Favourited", "favourite": fav.to_dict()}), 201

@social_routes.route("/recipes/<int:recipe_id>/favourites", methods=["DELETE"])
@login_required
def remove_favourite(recipe_id):
    fav = Favourite.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
    if not fav:
        return jsonify({"message": "Not favourited"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"message": "Unfavourited"}), 200

@social_routes.route("/recipes/<int:recipe_id>/favourites", methods=["GET"])
@login_required
def get_favourite_status(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    count = Favourite.query.filter_by(recipe_id=recipe_id).count()
    is_favourited = Favourite.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first() is not None
    return jsonify({"count": count, "isFavourited": is_favourited}), 200


# ---------- LIKES ----------
@social_routes.route("/recipes/<int:recipe_id>/likes/toggle", methods=["POST"])
@login_required
def toggle_like(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    like = Like.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return jsonify({"liked": False, "count": Like.query.filter_by(recipe_id=recipe_id).count()}), 200
    else:
        new_like = Like(user_id=current_user.id, recipe_id=recipe_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({"liked": True, "count": Like.query.filter_by(recipe_id=recipe_id).count()}), 201

@social_routes.route("/recipes/<int:recipe_id>/likes", methods=["GET"])
@login_required
def get_likes(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    count = Like.query.filter_by(recipe_id=recipe_id).count()
    user_liked = Like.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first() is not None
    return jsonify({"count": count, "userLiked": user_liked}), 200


# ---------- COMMENTS ----------
@social_routes.route("/recipes/<int:recipe_id>/comments", methods=["GET"])
def list_comments(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    q = Comment.query.filter_by(recipe_id=recipe_id).order_by(Comment.created_at.desc())
    paged = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "comments": [c.to_dict() for c in paged.items],
        "total": paged.total,
        "pages": paged.pages,
        "current_page": page
    }), 200

@social_routes.route("/recipes/<int:recipe_id>/comments", methods=["POST"])
@login_required
def create_comment(recipe_id):
    _, err = _recipe_or_404(recipe_id)
    if err: return err
    data = request.get_json() or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "Content is required"}), 400
    c = Comment(user_id=current_user.id, recipe_id=recipe_id, content=content)
    db.session.add(c)
    db.session.commit()
    return jsonify(c.to_dict()), 201

@social_routes.route("/comments/<int:comment_id>", methods=["PUT"])
@login_required
def update_comment(comment_id):
    c = Comment.query.get(comment_id)
    if not c: return jsonify({"error": "Comment not found"}), 404
    if c.user_id != current_user.id:
        return jsonify({"error": "Forbidden"}), 403
    data = request.get_json() or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "Content is required"}), 400
    c.content = content
    db.session.commit()
    return jsonify(c.to_dict()), 200

@social_routes.route("/comments/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    c = Comment.query.get(comment_id)
    if not c: return jsonify({"error": "Comment not found"}), 404
    if c.user_id != current_user.id:
        return jsonify({"error": "Forbidden"}), 403
    db.session.delete(c)
    db.session.commit()
    return jsonify({"message": "Comment deleted"}), 200