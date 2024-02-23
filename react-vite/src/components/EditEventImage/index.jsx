import React, { useState } from "react";
import { fetchEditImage, fetchGetEvent, fetchGetEventImages } from "../../redux/events";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import whitesquare from "../../../src/whitesquare.jpg";
import "./index.css";

function EditEventImage({imageId}) {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const { closeModal } = useModal();

    const [imageInfo, setImageInfo] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        let res;

        try {
            res = await dispatch(fetchEditImage(imageId, imageInfo));
            if (res && !res.url) {
                setErrors(res);
            } else {
                await dispatch(fetchGetEvent(eventId));
                await dispatch(fetchGetEventImages(eventId))
                closeModal();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
    <div id="edit-image-container">
        <form onSubmit={handleSubmit}>
            <h2>Edit Image</h2>
            <div>{errors}</div>
            <p>Please enter the image's new URL</p>
            <img id="image" alt="event image" src={imageInfo} className="image-preview"/>
            <input
                type="url"
                id="edit-image-input"
                value={imageInfo}
                onChange={(e) => setImageInfo(e.target.value)}
                placeholder="Use a URL ending with .jpg or .jpeg"
            />
            <button
                type="submit"
                disabled={!(imageInfo.endsWith(".jpg") && !(imageInfo.endsWith(".jpeg")))}
                className={(!(imageInfo.endsWith(".jpg") && (imageInfo&& !(imageInfo.endsWith(".jpeg"))))) ? "disabledButton" : "clickable"}
                id="edit-image-button">
                Edit
            </button>
        </form>
    </div>
    )
}

export default EditEventImage;
