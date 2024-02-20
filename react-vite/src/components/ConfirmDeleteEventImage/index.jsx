import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './index.css';

const ConfirmDeleteEventImage = ({ eventImageId, deleteEventImage }) => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const handleDelete = async (eventImageId) => {
        dispatch(deleteEventImage(eventImageId))
        closeModal();
    }

    return (
        <div className="delete-event-image-container">
            <b id="delete-event-image-confirm-delete">Delete Photo</b>
            <p>Would you like to delete this photo?</p>

            <div id="delete-event-image-buttons-container">
                <button className="delete-event-image-buttons-delete clickable" onClick={() => handleDelete(eventImageId)}>Yes (Delete Photo)</button>
                <button className="delete-event-image-buttons clickable" onClick={closeModal}>No (Keep Photo)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteEventImage;
