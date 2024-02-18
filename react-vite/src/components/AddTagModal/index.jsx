import React, { useState } from "react";
import { fetchAddTag, fetchGetEvent } from "../../redux/events";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";

function AddTagModal() {

    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { closeModal } = useModal();

    const [tagInfo, setTagInfo] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        let res;

        try {
            res = await dispatch(fetchAddTag(tagInfo, eventId));
            if (res && !res.location) {
                setErrors(res);
            } else {
                await dispatch(fetchGetEvent(eventId));
                closeModal();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add a Tag</h2>
                <div>{errors}</div>
                <input
                    type="text"
                    value={tagInfo}
                    onChange={(e) => setTagInfo(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={tagInfo.length < 2}>
                    Add
                </button>
            </form>
        </div>
    )
}

export default AddTagModal;
