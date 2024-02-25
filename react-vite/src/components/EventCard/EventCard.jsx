import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import UpdateEventModal from "../UpdateEventModal";
import ConfirmDeleteEvent from "../ConfirmDeleteEvent";
import { fetchDeleteEvent, fetchGetAllEvents } from "../../redux/events";
import "./EventCard.css";

function EventCard(props) {
    const { event } = props;
    const user = useSelector(state => state.session.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    let userId;
    if (user && user.id) userId = user.id;

    const sliceDate = (str) => str.slice(0, 16);

    const navigateToEventDetail = (e) => {
        e.stopPropagation();
        navigate(`/events/${event.id}`);
    }

    const handleButtonClick = (e) => {
        e.stopPropagation();
    }

    const deleteEvent = async () => {
        await dispatch(fetchDeleteEvent(event.id));
        await dispatch(fetchGetAllEvents());
        closeModal();
    }

    return (
        <div key={event.name} onClick={navigateToEventDetail} className="clickable event-card">
            <h3>
                {event.name}
            </h3>
            <div className="img-container">
                <img className="preview_image" src={event.preview_image ? event.preview_image : "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="event preview image" />
            </div>
            <div>{sliceDate(event.date_hosted.toString())}</div>
            <div>{event.location}</div>
            {(userId && event && event.owner_id == userId) && (
            <div className="button-div">
                <OpenModalButton
                    buttonText="Update"
                    onButtonClick={handleButtonClick}
                    className="clickable"
                    modalComponent={<UpdateEventModal event={event} />}
                />
                <OpenModalButton
                    buttonText="Delete"
                    onButtonClick={handleButtonClick}
                    className="clickable"
                    modalComponent={<ConfirmDeleteEvent eventId={event.id} deleteEvent={deleteEvent}/>}
                />
            </div>)}
        </div>
    )
}

export default EventCard;
