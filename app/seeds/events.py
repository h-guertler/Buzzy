from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text

def seed_events():
    craft_show = Event(
        owner_id=2,
        name="craft show",
        description="buy and sell crafty wares!",
        location="123 main st, anywhere, usa",
        date_hosted="2024-10-10 8:00:00.000000",
        # FLAG CHANGE
        attendees=[],
        tags=[],
        private=False)
    metal_show = Event(
        owner_id=2,
        name="metal show",
        description="the loudest night of your life!",
        location="321 main st, anywhere, usa",
        date_hosted="2024-05-01 22:00:00.000000",
        # FLAG
        attendees=[],
        tags=[],
        private=False)
    house_party = Event(
        owner_id=1,
        name="house party",
        description="it's all in the name",
        location="123 residential st, anywhere, usa",
        date_hosted="2025-12-31 21:00:00.000000",
        # FLAG
        attendees=[2],
        tags=[],
        private=True)

    db.session.add(craft_show)
    db.session.add(metal_show)
    db.session.add(house_party)
    db.session.commit()

def undo_events():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.events RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM events"))

    db.session.commit()
