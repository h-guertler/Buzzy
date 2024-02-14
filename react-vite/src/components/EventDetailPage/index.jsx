import React from "react";
import { useParams } from "react-router-dom";

function EventDetailPage() {
    const { eventId } = useParams();

    // fetch the event detail page
    return (
        <h1>Hello from event detail page!!</h1>
    )
}

export default EventDetailPage;
