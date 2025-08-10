from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import JSON
from datetime import datetime

class Favourite(db.Model):
    __tablename__ = 'favourites'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="favourites")
    recipe = db.relationship("Recipe", backref="favourited_by")

    # Prevent duplicate favourites
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_favourite'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'username': self.user.username if self.user else None,
            'recipe_title': self.recipe.title if self.recipe else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="comments")
    recipe = db.relationship("Recipe", backref="comments")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'content': self.content,
            'username': self.user.username if self.user else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Like(db.Model):
    __tablename__ = 'likes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="likes")
    recipe = db.relationship("Recipe", backref="liked_by")

    # Prevent duplicate likes
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_like'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'username': self.user.username if self.user else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }