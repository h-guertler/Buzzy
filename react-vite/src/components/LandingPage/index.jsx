import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllEvents } from "../../redux/events";
import EventCard from "../EventCard/EventCard";

function LandingPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchEvents() {
        await dispatch(fetchGetAllEvents())
      }
      fetchEvents();
  }, [dispatch]);

  const events = useSelector(state => state.events.events)
  const eventArray = events ? events.events : [];

  const renderedEvents = eventArray.map((event) => (
    <EventCard event={event} key={event.id}/>
  ))

    return (
        <div>
            {renderedEvents}
        </div>
    )
}

export default LandingPage;
