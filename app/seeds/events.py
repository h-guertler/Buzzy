from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text

def seed_events():
    craft_show = Event(
        owner_id=2,
        name="Crafty Corner",
        description="Discover handmade treasures at Crafty Corner! Browse unique crafts, art, and homemade goods from talented local artisans. Don't miss this chance to support creativity and find one-of-a-kind gifts!",
        location="Bangor, ME",
        date_hosted="2025-03-10 8:00:00.000000",
        attendees=[],
        tags=[],
        preview_image="https://images.joseartgallery.com/100736/conversions/what-kind-of-art-is-popular-right-now-thumb1280.jpg",
        private=False)
    metal_show = Event(
        owner_id=1,
        name="AltFest",
        description="Experience AltFest in Colorado Springs! Join us for a day of alternative music, art, and culture. Get ready for an unforgettable festival showcasing indie bands, local artists, and delicious food.",
        location="Colorado Springs, CO",
        date_hosted="2025-05-01 16:00:00.000000",
        attendees=[],
        tags=[],
        preview_image="https://www.yondervacationrentals.com/wp-content/uploads/2022/12/Live-Music-Shutterstock.jpg",
        private=False)
    house_party = Event(
        owner_id=1,
        name="NYE Party",
        description="Celebrate New Year's Eve in style at 123 Residential Ave, Charlotte, NC! Join us for a festive evening filled with music, laughter, and great company. Bring a dish to share, and feel free to add to our custom playlist!",
        location="Charlotte, NC",
        date_hosted="2024-12-31 21:00:00.000000",
        attendees=[2],
        tags=["board games", "casual", "potluck", "collab playlist"],
        preview_image="https://www.ontariosciencecentre.ca/media/2093/fireworkscircle3.jpg",
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
