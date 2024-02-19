import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchDeleteTag } from "../../redux/events";
import './index.css';

const ConfirmDeleteTag = ({ eventId, tag }) => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const handleDelete = async (tag, eventId) => {
        await dispatch(fetchDeleteTag(tag, eventId))
        closeModal();
    }

    return (
        <div className="delete-tag-container">
            <b id="delete-tag-confirm-delete">Delete Tag</b>
            <p>Would you like to delete the tag {tag}?</p>

            <div className="delete-tag-buttons-container">
                <button className="delete-tag-buttons-delete clickable" onClick={() => handleDelete(tag, eventId)}>Yes (Delete Tag)</button>
                <button className="delete-tag-buttons clickable" onClick={closeModal}>No (Keep Tag)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteTag;
