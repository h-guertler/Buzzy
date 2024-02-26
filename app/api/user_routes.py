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
    # query = db.session.query(Event_Image) \
    #     .filter(Event_Image.user_id == id) \
    #     .all()

    query = db.session.query(Event_Image, Event.name) \
            .join(Event, Event_Image.event_id == Event.id) \
            .filter(Event_Image.user_id == id) \
            .all()

    images_with_event_names = []

    for event_image, name in query:
        images_with_event_names.append({
            "id": event_image.id,
            "user_id": event_image.user_id,
            "event_id": event_image.event_id,
            "url": event_image.url,
            "created_at": event_image.created_at,
            "name": name
        })

    return { "event images": images_with_event_names }


@user_routes.route('/current/events')
def get_user_events():
    current_user_id = current_user.id

    query = db.session.query(Event) \
        .filter(Event.owner_id == current_user_id) \
        .all()

    events = [event.to_dict() for event in query]

    return { "events": events }
