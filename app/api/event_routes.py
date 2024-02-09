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

# Creates a new event
@event_routes.route('/new', methods=["POST"])
@login_required
def create_event():
    user_id = current_user.id
    name = request.json.get('name', None)
    description = request.json.get('description', None)
    date_hosted = request.json.get('date_hosted', None)
    location = request.json.get('location', None)
    attendees = request.json.get('attendees', [])
    tags = request.json.get('tags', [])
    private = request.json.get('private', None)

    # Backend validation
    validation_errors = {}

    if name is None:
        validation_errors["name"] = "Please provide a name"
    if description is None or len(description) < 10 or len(description) > 255:
        validation_errors["description"] = "Please provide a description between 10 and 255 characters"
    if location is None:
        validation_errors["location"] = "Please provide a location"
    if date_hosted is None:
        validation_errors["date_hosted"] = "Please provide a date"
    if private is None:
        validation_errors["privacy"] = "Please select a privacy setting"

    if validation_errors:
        return validation_errors, 500

    # Creates the event and returns it upon successful creation
    event = Event(
        owner_id= user_id,
        name=name,
        description=description,
        location=location,
        date_hosted=date_hosted,
        attendees=attendees,
        tags=tags,
        private=private
    )

    db.session.add(event)
    db.session.commit()

    return event.to_dict()


# View or update an event
@event_routes.route('/<int:id>', methods=["GET", "PUT"])
def get_event(id):
    if current_user.is_authenticated:
        user_id = current_user.id
    else:
        user_id = None

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    # View an event
    if request.method == "GET":
        # Determines whether user is authorized to view the event
        authorized = False

        if event.private == False:
            authorized = True
        elif event.owner_id == user_id:
            authorized = True
        elif user_id in event.attendees:
            authorized = True

        if authorized == False:
            message = "You are not authorized to view this resource"
            return message, 401

        # Returns the event if it's found and the user is authorized to view it
        else:
            return event.to_dict()

    # Edit an event
    if request.method == "PUT":
        # Returns an unauthorized message if the logged in user does not own the event
        if not event.owner_id == user_id:
            message = "You are not authorized to edit this resource"
            return message, 401

        new_name = request.json.get("name", None)
        new_description = request.json.get("description", None)
        new_date_hosted = request.json.get("date_hosted", None)
        new_location = request.json.get("location", None)
        new_private = request.json.get("private", None)

        # Backend validations
        validation_errors = {}

        if new_description is not None and (len(new_description) < 10 or len(new_description) > 255):
            validation_errors["description"] = "Please provide a description between 10 and 255 characters"
            return validation_errors, 500

        # Updates any fields which were provided in the request body
        if not new_name == None:
            event.name = new_name
        if not new_description == None:
            event.description = new_description
        if not new_date_hosted == None:
            event.date_hosted = new_date_hosted
        if not new_location == None:
            event.location = new_location
        if not new_private == None:
            event.private == new_private

        if new_name or new_description or new_date_hosted or new_location or new_private:
            event.updated_at = datetime.utcnow()

        # Adds any changes to the database
        db.session.commit()

        # Retrieves and returns the updated event
        updated_event = Event.query.get(id)
        return updated_event.to_dict()

# {
#     "name": "just anotherr event",
#     "description": "a typical event",
#     "date_hosted": "2024-03-16 8:00:00.000000",
#     "location": "some place",
#     "private": false
# }
