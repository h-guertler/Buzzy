from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Event_Image(db.Model):
    __tablename__ = 'event_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('events.id')))
    url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', back_populates='event_images')
    event = db.relationship('Event', back_populates='event_images')

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'user_id': self.user_id,
            'event_id': self.event_id
        }
