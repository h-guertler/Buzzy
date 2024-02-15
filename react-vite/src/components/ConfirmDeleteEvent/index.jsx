import { useModal } from "../../context/Modal";
import './index.css';

const ConfirmDeleteEvent = ({ eventId, deleteEvent }) => {
    const { closeModal } = useModal();

    return (
        <div className="delete-event-container">
            <b id="delete-event-confirm-delete">Delete Event</b>
            <p>Would you like to delete this event?</p>

            <div className="delete-event-buttons-container">
                <button className="delete-event-buttons-delete clickable" onClick={() => deleteEvent(eventId)}>Yes (Delete Event)</button>
                <button className="delete-album-buttons clickable" onClick={closeModal}>No (Keep Event)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteEvent;
