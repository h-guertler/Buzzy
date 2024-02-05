from flask import Blueprint, request
from app.models import User, Event, Event_Image, db
from flask_login import current_user, login_required
from datetime import datetime

image_routes = Blueprint('images', __name__)

@image_routes.route('/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def handle_event_image(id):
    image = Event_Image.query.get(id)

    # Returns a 404 error if there is no event_image with the specified ID
    if not image:
        error = "Event image with the specified ID could not be found"
        return error, 404

    # Returns a 403 error if the event_image does not belong to the logged in user
    if image and not image.user_id == current_user.id:
        error = "You are not authorized to access this resource"
        return error, 401


    if request.method == 'PUT':
        new_url = request.json.get("url", None)

        # Backend validation
        validation_errors = {}

        if new_url is None:
            validation_errors["url"] = "Please provide an image URL"
        elif not new_url.lower().endswith((".jpg", ".jpeg")):
            validation_errors["url"] = "Image URL must end in .jpg or .jpeg"

        if validation_errors:
            return validation_errors, 500

        # Updates the event_image with the new URL and new updated_at to reflect the change
        image.url = new_url
        image.updated_at = datetime.utcnow()

        db.session.commit()

        # Retrieves and returns the updated event_image
        updated_image = Event_Image.query.get(id)
        return updated_image.to_dict()
