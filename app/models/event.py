from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.ext.mutable import Mutable

class MutableList(Mutable, list):
    def append(self, value):
        list.append(self, value)
        self.changed()

    @classmethod
    def coerce(cls, key, value):
        if not isinstance(value, MutableList):
            if isinstance(value, list):
                return MutableList(value)
            return Mutable.coerce(key, value)
        else:
            return value


class Event(db.Model):
    __tablename__ = 'events'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    name = db.Column(db.String(40), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date_hosted = db.Column(db.DateTime, nullable=False)
    attendees = db.Column(MutableList.as_mutable(db.ARRAY(db.Integer)))
    tags = db.Column(MutableList.as_mutable(db.ARRAY(db.String(20))))
    preview_image = db.Column(db.String(255))
    private = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    owner = db.relationship('User', back_populates='events', foreign_keys=[owner_id])
    event_favorites = db.relationship('Event_Favorite', back_populates='event')
    event_images = db.relationship('Event_Image', back_populates='event')


    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'date_hosted': self.date_hosted,
            'preview_image': self.preview_image,
            'attendees': self.attendees,
            'tags': self.tags,
            'private': self.private
        }
