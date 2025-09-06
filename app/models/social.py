from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

# Helper: combine schema (in production) with any constraints you pass in.
def _table_args_with_schema(*constraints):
    if environment == "production":
        return (*constraints, {'schema': SCHEMA})
    return (*constraints,)

class Favourite(db.Model):
    __tablename__ = 'favourites'
    __table_args__ = _table_args_with_schema(
        db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_favourite')
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('users.id')),
        nullable=False
    )
    recipe_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('recipes.id'), ondelete='CASCADE'),
        nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="favourites")
    # passive_deletes=True lets the DB handle cascades without SQLAlchemy preloading children
    recipe = db.relationship("Recipe", backref="favourited_by", passive_deletes=True)

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
    __table_args__ = _table_args_with_schema()

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('users.id')),
        nullable=False
    )
    recipe_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('recipes.id'), ondelete='CASCADE'),
        nullable=False
    )
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="comments")
    recipe = db.relationship("Recipe", backref="comments", passive_deletes=True)

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
    __table_args__ = _table_args_with_schema(
        db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_like')
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('users.id')),
        nullable=False
    )
    recipe_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('recipes.id'), ondelete='CASCADE'),
        nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="likes")
    recipe = db.relationship("Recipe", backref="liked_by", passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'username': self.user.username if self.user else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }