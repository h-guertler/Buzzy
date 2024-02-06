from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, db, Event_Image, Event

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/eventimages')
def get_user_event_images(id):
    user = User.query.get(id)
    # Returns a 404 error if there is no user with the specified ID
    if not user:
        error = 'User with the specified ID could not be found'
        return error, 404

    # Queries for all of the user's event images
    query = db.session.query(Event_Image) \
        .filter(Event_Image.user_id == id) \
        .all()

    images = [image.to_dict() for image in query]

    return { "event images": images }


@user_routes.route('/<int:id>/events')
def get_user_events(id):
    user = User.query.get(id)
    # Returns a 404 error if there is no user with the specified ID
    if not user:
        error = 'User with the specified ID could not be found'
        return error, 404

    query = db.session.query(Event) \
        .filter(Event.owner_id == id) \
        .all()

    events = [event.to_dict() for event in query]

    return { "events": events }
