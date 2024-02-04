from flask import Blueprint, request
from app.models import db, User, Event, Event_Image
from flask_login import current_user, login_required
from datetime import datetime
from sqlalchemy import or_, func, desc, case
from sqlalchemy.sql import func
from sqlalchemy.orm import joinedload

event_routes = Blueprint('events', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Create an event image
@event_routes.route('/<int:id>/images', methods=["POST"])
@login_required
def create_event_image(id):
    current_user_id = current_user.id
    event_id = id

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    url = request.json.get("url", None)

    # Backend validation
    validation_errors = {}

    if url is None:
        validation_errors["url"] = "Please provide an image URL"
    elif not url.lower().endswith((".jpg", ".jpeg")):
        validation_errors["url"] = "Image URL must end in .jpg or .jpeg"

    if validation_errors:
        return validation_errors, 500

    # Creates a new event image and adds it to the database
    new_image = Event_Image(
        user_id = current_user_id,
        event_id = event_id,
        url = url
        )

    db.session.add(new_image)
    db.session.commit()

    # Finds the newly created image to confirm sucess of operation
    created_image = db.session.query(Event_Image) \
        .filter(Event_Image.url == url, Event_Image.user_id == current_user_id, Event_Image.event_id == event_id) \
        .first()

    return created_image.to_dict()


# View an event's images
@event_routes.route('/<int:id>/images', methods=["GET"])
def get_event_images(id):
    current_user_id = current_user.id
    event_id = id

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    attendees = event.attendees
    authorized = False
    images = []

    if event and event.private == True:
        if event.owner_id == current_user_id:
            authorized = True
        if current_user_id in attendees:
            authorized = True

    if event and event.private == False:
        authorized = True

    if authorized == True:
        # Queries the database for all event_images with an event_id of event_id
        query = db.session.query(Event_Image) \
        .filter(Event_Image.event_id == event_id) \
        .all()

        # Formats the data from the query above
        images = [image.to_dict() for image in query]

        return { "event images": images }

    else:
        msg = { "error": "You are unauthorized to view this resource" }
        return msg, 401