import React from "react";

function EventCard(props) {
    const { event } = props;

    return (
        <div key={event.name}>
            <h3>
                {event.name}
            </h3>
            <div>{event.location}</div>
            <div>{event.date_hosted}</div>
        </div>
    )
}

export default EventCard;
