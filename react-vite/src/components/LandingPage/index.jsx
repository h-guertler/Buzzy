import { useEffect } from "react";
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
  const user = useSelector(state => state.session.user);
  const userId = user && user.id ? user.id : null;

  const isEventInFuture = (dateHostedString) => {
    const eventDate = new Date(dateHostedString);
    const currentDate = new Date();
    return eventDate > currentDate;
  };

  const isUserInvited = (attendeeArray, userId) => {
    return attendeeArray.includes(userId);
  }

  const renderedEvents = eventArray.map((event) => {
    const dateToCheck = event.date_hosted;
    const attendeeArray = event.attendees;

    if ((isEventInFuture(dateToCheck))
      && (event.private == false || isUserInvited(attendeeArray, userId) || userId == event.owner_id)) {
        return <EventCard event={event} key={event.id}/>
    } else {
      return null;
    }
  });

    return (
      <div className="landing-page-cover">
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
