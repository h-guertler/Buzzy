from flask import Blueprint, request, jsonify
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
    if current_user.is_authenticated:
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
        query = db.session.query(Event_Image, User.username) \
            .join(User, Event_Image.user_id == User.id) \
            .filter(Event_Image.event_id == event_id) \
            .all()

        images_with_usernames = []

        # Formats the data from the query above
        for image, username in query:
            images_with_usernames.append({
                "id": image.id,
                "url": image.url,
                "event_id": image.event_id,
                "user_id": image.user_id,
                "username": username,
                "created_at": image.created_at
            })

        return { "event images": images_with_usernames }

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
    preview_image = request.json.get('preview_image', None)
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
        preview_image=preview_image,
        attendees=attendees,
        tags=tags,
        private=private
    )

    db.session.add(event)
    db.session.commit()

    return event.to_dict()

# Add or remove an attendee
@event_routes.route('/<int:id>/attendees', methods=["POST", "DELETE"])
def add_or_remove_attendee(id):
    if current_user.is_authenticated:
        user_id = current_user.id
    else:
        user_id = None

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    # Returns an unauthorized message if the logged in user does not own the event
    if not event.owner_id == user_id:
        message = "You are not authorized to edit this resource"
        return message, 401

    # Add an attendee
    if request.method == "POST":
        # Extracts the username or email from the request
        user_info = request.json.get("user_info")

        # Uses the submitted information to find a user, whose ID is then added to the event's attendees
        queried_user = db.session.query(User) \
            .filter((User.email == user_info) | (User.username == user_info)) \
            .first()

        if queried_user:
            if queried_user.id in event.attendees:
                message = "You have already invited this user to your event"
                return jsonify(message), 400
            else:
                event.attendees.append(queried_user.id)
                event.updated_at = datetime.utcnow()
                db.session.add(event)
                db.session.commit()
                event = Event.query.get(id)
                return event.to_dict()

        else:
            message = "Unable to find a user with the specified email or username"
            return jsonify(message), 400

    # Remove an attendee
    if request.method == "DELETE":
        deleted_id = request.json.get("deleted_id")

        # Removes the user ID from the list of attendees if it's found in the list,
        # then returns the updated event
        if deleted_id in event.attendees:
            event.attendees = [ele for ele in event.attendees if ele != deleted_id]
            event.updated_at = datetime.utcnow()
            db.session.add(event)
            db.session.commit()
            event = Event.query.get(id)
            return event.to_dict()

        # Returns an error message if the user ID is not found in the event's list of attendees
        else:
            message = "Unable to find an event attendee with the specified username or email"
            return message, 400


# View or update an event
@event_routes.route('/<int:id>', methods=["GET", "PUT", "DELETE"])
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

    # Returns an unauthorized message if the logged in user does not own the event
    if not event.owner_id == user_id:
        message = "You are not authorized to edit this resource"
        return message, 401

    # Edit an event
    if request.method == "PUT":

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

    # Delete an event
    if request.method == "DELETE":
        db.session.delete(event)
        db.session.commit()

        message = "Success: Event has been removed"
        return jsonify(message), 200

# Add or remove an event tag
@event_routes.route('/<int:id>/tags', methods=["POST", "DELETE"])
def add_or_remove_tag(id):
    if current_user.is_authenticated:
        user_id = current_user.id
    else:
        user_id = None

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    # Returns an unauthorized message if the logged in user does not own the event
    if not event.owner_id == user_id:
        message = "You are not authorized to edit this resource"
        return message, 401

    # Add an event tag
    if request.method == "POST":
        tag = request.json.get("tag", None)
        if (tag == None) or (len(tag) < 2) or (len(tag) > 20):
            message = "Please add a tag between 2 and 20 characters"
            return message, 500

        if tag not in event.tags:
            event.tags.append(tag)
            event.updated_at = datetime.utcnow()
            db.session.add(event)
            db.session.commit()
            event = Event.query.get(id)
            return event.to_dict()
        else:
            message = "You have already added this event tag"
            return message, 400

    # Delete an event tag
    if request.method == "DELETE":
        tag = request.json.get("tag", None)
        if tag == None:
            message = "Please select a tag to remove"
            return message, 500

        if tag and tag not in event.tags:
            message = "The event does not contain this tag"
            return message, 400
        else:
            event.tags = [ele for ele in event.tags if ele != tag]
            event.updated_at = datetime.utcnow()
            db.session.add(event)
            db.session.commit()
            event = Event.query.get(id)
            return event.to_dict()


# Get all events
@event_routes.route('/all', methods=["GET"])
def get_events():
    query = db.session.query(Event) \
        .all()

    events = [event.to_dict() for event in query]

    return { "events": events }


# Get usernames of all event attendees
@event_routes.route('/<int:id>/attendees', methods=["GET"])
def get_attendee_usernames(id):
    if current_user.is_authenticated:
        user_id = current_user.id
    else:
        user_id = None

    # Exits with status 404 if no event with the ID in the URL exists
    event = Event.query.get(id)
    if not event:
        error = { "error": "Event with the specified id does not exist" }
        return error, 404

    # Returns an unauthorized message if the logged in user does not own the event and is not in the list of attendees
    if (not event.owner_id == user_id) and (not user_id in event.attendees):
        message = "You are not authorized to access this resource"
        return message, 401

    user_ids = event.attendees
    users = User.query.filter(User.id.in_(user_ids)).all()
    usernames = [user.username for user in users]
    return usernames
