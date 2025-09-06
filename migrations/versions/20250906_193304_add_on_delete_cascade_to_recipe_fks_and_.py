"""Add ON DELETE CASCADE to recipe FKs and grocery_list_items

Revision ID: add_cascade_20250906
Revises: aa7046c6eb40
Create Date: 2025-09-06
"""
from alembic import op
import sqlalchemy as sa
import os

# revision identifiers, used by Alembic.
revision = 'add_cascade_20250906'
down_revision = 'aa7046c6eb40'
branch_labels = None
depends_on = None

SCHEMA = os.environ.get("SCHEMA")

def _dialect():
    return op.get_bind().dialect.name

def _set_search_path_if_pg():
    if _dialect() == "postgresql" and SCHEMA:
        op.execute(f'SET search_path TO "{SCHEMA}"')

def _schema_arg_for_batch():
    # Only pass schema for Postgres; SQLite has no schemas
    return SCHEMA if _dialect() == "postgresql" else None

def upgrade():
    # SQLite: skip (no schemas, limited FK ops in-place)
    if _dialect() == "sqlite":
        return

    _set_search_path_if_pg()
    schema_arg = _schema_arg_for_batch()

    # --- comments.recipe_id -> recipes.id (CASCADE) ---
    with op.batch_alter_table('comments', schema=schema_arg) as batch:
        # If names differ on prod, adjust these drop names
        batch.drop_constraint('comments_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'comments_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id'],
            ondelete='CASCADE'
        )

    # --- favourites.recipe_id -> recipes.id (CASCADE) ---
    with op.batch_alter_table('favourites', schema=schema_arg) as batch:
        batch.drop_constraint('favourites_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'favourites_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id'],
            ondelete='CASCADE'
        )

    # --- likes.recipe_id -> recipes.id (CASCADE) ---
    with op.batch_alter_table('likes', schema=schema_arg) as batch:
        batch.drop_constraint('likes_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'likes_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id'],
            ondelete='CASCADE'
        )

    # --- grocery_list_items.grocery_list_id -> grocery_lists.id (CASCADE) ---
    with op.batch_alter_table('grocery_list_items', schema=schema_arg) as batch:
        batch.drop_constraint('grocery_list_items_grocery_list_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'grocery_list_items_grocery_list_id_fkey',
            'grocery_lists',
            ['grocery_list_id'], ['id'],
            ondelete='CASCADE'
        )

def downgrade():
    # SQLite: skip (no-op)
    if _dialect() == "sqlite":
        return

    _set_search_path_if_pg()
    schema_arg = _schema_arg_for_batch()

    with op.batch_alter_table('grocery_list_items', schema=schema_arg) as batch:
        batch.drop_constraint('grocery_list_items_grocery_list_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'grocery_list_items_grocery_list_id_fkey',
            'grocery_lists',
            ['grocery_list_id'], ['id']
        )

    with op.batch_alter_table('likes', schema=schema_arg) as batch:
        batch.drop_constraint('likes_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'likes_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id']
        )

    with op.batch_alter_table('favourites', schema=schema_arg) as batch:
        batch.drop_constraint('favourites_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'favourites_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id']
        )

    with op.batch_alter_table('comments', schema=schema_arg) as batch:
        batch.drop_constraint('comments_recipe_id_fkey', type_='foreignkey')
        batch.create_foreign_key(
            'comments_recipe_id_fkey',
            'recipes',
            ['recipe_id'], ['id']
        )
