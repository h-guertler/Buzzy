import React, { useState } from "react";
import { fetchAddAttendee, fetchGetEvent } from "../../redux/events";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";

function AddAttendeeModal() {

    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { closeModal } = useModal();

    const [attendeeInfo, setAttendeeInfo] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        let res;

        try {
            const res = await dispatch(fetchAddAttendee(eventId, attendeeInfo));
            console.log("res: ", res)
            if (res && !res.ok) {
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
                <h2>Add a Guest</h2>
                <div>{errors}</div>
                <p>Please enter the guest email or username</p>
                <input
                    type="text"
                    value={attendeeInfo}
                    onChange={(e) => setAttendeeInfo(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={attendeeInfo.length < 2}>
                    Add
                </button>
            </form>
        </div>
    )
}

export default AddAttendeeModal;
