class GroceryList(db.Model):
    __tablename__ = 'grocery_lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="grocery_lists")
    items = db.relationship("GroceryListItem", backref="grocery_list", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }


class GroceryListItem(db.Model):
    __tablename__ = 'grocery_list_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    grocery_list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('grocery_lists.id')), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.String(100))
    notes = db.Column(db.String(500))
    checked_off = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'grocery_list_id': self.grocery_list_id,
            'item_name': self.item_name,
            'quantity': self.quantity,
            'notes': self.notes,
            'checked_off': self.checked_off,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }