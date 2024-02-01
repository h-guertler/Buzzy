from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Event_Favorite(db.Model):
    __tablename__ = 'event_favorites'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('events.id')))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', back_populates='event_favorites')
    event = db.relationship('Event', back_populates='event_favorites')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id
        }
