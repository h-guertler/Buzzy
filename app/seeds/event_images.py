from app.models import db, Event_Image, environment, SCHEMA
from sqlalchemy.sql import text


def seed_event_images():
    image_one = Event_Image(
        user_id=1, event_id=1, url='https://upload.wikimedia.org/wikipedia/en/f/ff/Morning_Glory_Flower_square.jpg')
    image_two = Event_Image(
        user_id=2, event_id=1, url='https://mypoppet.com.au/makes/mp-content/uploads/2020/02/magic-yarn-ball_2.jpg')
    image_three = Event_Image(
        user_id=1, event_id=2, url='https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/asheville/Sierra_Nevada_Resize_FB_06a29a19-7eaa-4cd1-85a6-c85afa233342.jpg')
    image_four = Event_Image(
        user_id=2, event_id=3, url='https://cdn.britannica.com/82/203482-050-E2ABDA79/People-fireworks.jpg')
    image_five = Event_Image(
        user_id=1, event_id=3, url='https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg')

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
