from app.models import db, Event_Image, environment, SCHEMA
from sqlalchemy.sql import text


def seed_event_images():
    image_one = Event_Image(
        user_id=1, event_id=2, url='imageone.fake.com')
    image_two = Event_Image(
        user_id=2, event_id=1, url='imagetwo.fake.com')
    image_three = Event_Image(
        user_id=1, event_id=2, url='imagethree.fake.com')
    image_four = Event_Image(
        user_id=1, event_id=3, url='https://images.fineartamerica.com/images-medium-large-5/rachel-dahlia-flower-square-barbara-griffin.jpg')
    image_five = Event_Image(
        user_id=1, event_id=3, url='https://upload.wikimedia.org/wikipedia/en/f/ff/Morning_Glory_Flower_square.jpg')

    db.session.add(image_one)
    db.session.add(image_two)
    db.session.add(image_three)
    db.session.add(image_four)
    db.session.add(image_five)
    db.session.commit()

def undo_event_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.event_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM event_images"))

    db.session.commit()
