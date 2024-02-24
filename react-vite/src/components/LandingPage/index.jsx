import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllEvents } from "../../redux/events";
import EventCard from "../EventCard/EventCard";
import "./LandingPage.css";

function LandingPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchEvents() {
        await dispatch(fetchGetAllEvents())
      }
      fetchEvents();
  }, [dispatch]);

  const events = useSelector(state => state.events.events)
  const eventArray = events && events.events ? events.events : [];

  const renderedEvents = eventArray.map((event) => (
    <EventCard event={event} key={event.id}/>
  ));

    return (
      <div>
        <h1>Events</h1>
        <div className="container-for-grid">
          <div className="events-grid">
            {renderedEvents}
          </div>
        </div>
      </div>
    )
}

export default LandingPage;
