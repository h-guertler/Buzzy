from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text

def seed_events():
    craft_show = Event(
        owner_id=2,
        name="craft show",
        description="buy and sell crafty wares!",
        location="123 main st, anywhere, usa",
        date_hosted="2024-10-10 8:00:00.000000",
        attendees=[],
        tags=[],
        preview_image="https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb1280.jpg",
        private=False)
    metal_show = Event(
        owner_id=2,
        name="metal show",
        description="the loudest night of your life!",
        location="321 main st, anywhere, usa",
        date_hosted="2024-05-01 22:00:00.000000",
        attendees=[],
        tags=[],
        preview_image="https://www.yondervacationrentals.com/wp-content/uploads/2022/12/Live-Music-Shutterstock.jpg",
        private=False)
    house_party = Event(
        owner_id=1,
        name="house party",
        description="it's all in the name",
        location="123 residential st, anywhere, usa",
        date_hosted="2025-12-31 21:00:00.000000",
        attendees=[2],
        tags=["board games", "casual", "potluck", "collab playlist"],
        private=False)

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
