import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchRemoveAttendee } from "../../redux/events";
import './index.css';

const ConfirmDeleteAttendee = ({ eventId, userId, username }) => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const handleDelete = async (eventId, userId, username) => {
        await dispatch(fetchRemoveAttendee(eventId, userId, username))
        closeModal();
    }

    return (
        <div className="delete-tag-container">
            <b id="delete-tag-confirm-delete">Remove Guest</b>
            <p>Would you like to delete the guest <span className="tag-text">{username}</span>?</p>

            <div className="delete-tag-buttons-container">
                <button className="delete-tag-buttons-delete clickable" onClick={() => handleDelete(eventId, userId, username)}>Yes (Delete Guest)</button>
                <button className="delete-tag-buttons clickable" onClick={closeModal}>No (Keep Guest)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteAttendee;
