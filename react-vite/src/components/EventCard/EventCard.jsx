import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";
import UpdateEventModal from "../UpdateEventModal";
import "./EventCard.css";

function EventCard(props) {
    const { event } = props;
    const user = useSelector(state => state.session.user);
    const navigate = useNavigate();

    let userId;
    if (user && user.id) userId = user.id;

    const sliceDate = (str) => str.slice(0, 16);
    const ownedByUser = (userId && event.owner_id == userId);

    const navigateToEventDetail = (e) => {
        e.stopPropagation();
        navigate(`/events/${event.id}`);
    }

    const handleButtonClick = (e) => {
        e.stopPropagation();
    }

    return (
        <div key={event.name} onClick={navigateToEventDetail} className="clickable">
            <h3>
                {event.name}
            </h3>
            <div>{event.location}</div>
            <div>{sliceDate(event.date_hosted.toString())}</div>
            <img className="preview_image" src={event.preview_image ? event.preview_image : "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="event preview image" />
            <div className="button-div" hidden={!ownedByUser}>
                <OpenModalButton
                    buttonText="Update"
                    onButtonClick={handleButtonClick}
                    modalComponent={<UpdateEventModal />}
                />
                <OpenModalButton
                    buttonText="Delete"
                    onButtonClick={handleButtonClick}
                    modalComponent={<DeleteEventModal />}
                />
            </div>
        </div>
    )
}

export default EventCard;
