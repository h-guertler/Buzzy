import EventCard from "../EventCard/EventCard";
import { useSelector } from "react-redux";

const UserEvents = () => {
    const userEventsObj = useSelector((state) => state.events.userEvents);
    const userEventsArray = userEventsObj["events"];

    const renderedEvents = userEventsArray.map((event) => (
        <EventCard event={event} key={event.id}/>
    ));

    return (
    <div>
        <div className="container-for-grid">
            <div className="events-grid">
                {renderedEvents}
            </div>
        </div>
    </div>
    )
};

export default UserEvents;
