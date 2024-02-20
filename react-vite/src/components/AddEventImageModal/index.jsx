import React, { useState } from "react";
import { fetchAddImage, fetchGetEvent, fetchGetEventImages } from "../../redux/events";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import whitesquare from "../../../src/whitesquare.jpg";
import "./index.css";

function AddEventImageModal() {

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
            res = await dispatch(fetchAddImage(imageInfo, eventId));
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
        <div id="add-image-container">
            <form onSubmit={handleSubmit}>
                <h2>Add a Photo</h2>
                <div>{errors}</div>
                <p>Please enter the image's URL</p>
                <img id="image" alt="your image here" src={imageInfo ? imageInfo : whitesquare} className="image-preview"/>
                <input
                    type="url"
                    id="image-input"
                    value={imageInfo}
                    onChange={(e) => setImageInfo(e.target.value)}
                    placeholder="Use a URL ending with .jpg or .jpeg"
                />
                <button
                    type="submit"
                    disabled={!(imageInfo.endsWith(".jpg") && !(imageInfo.endsWith(".jpeg")))}
                    className={(imageInfo.endsWith(".jpg") || (imageInfo.endsWith(".jpeg"))) ? "clickable" : "disabledButton"}
                    id="submit-image-button">
                    Add
                </button>
            </form>
        </div>
    )
}

export default AddEventImageModal;
