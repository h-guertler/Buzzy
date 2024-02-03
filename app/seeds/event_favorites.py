from app.models import db, Event_Favorite, environment, SCHEMA
from sqlalchemy.sql import text


def seed_event_favorites():
    favorite_one = Event_Favorite(
        user_id=1, event_id=1)
    favorite_two = Event_Favorite(
        user_id=1, event_id=2)

    db.session.add(favorite_one)
    db.session.add(favorite_two)
    db.session.commit()

def undo_event_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.event_favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM event_favorites"))

    db.session.commit()
