import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUpdateEvent } from "../../redux/events";
import { useModal } from "../../context/Modal";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

import "./index.css";

function UpdateEventModal(event) {
    const eventObj = event["event"];
    const { id, owner_id, name, description, location, preview_image, date_hosted, tags, attendees, privacy } = eventObj;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const origDate = date_hosted ? new Date(date_hosted) : null;

    const [newName, setNewName] = useState(name ? name : "");
    const [newDescription, setNewDescription] = useState(description ? description : "");
    const [newDateHosted, setNewDateHosted] = useState(origDate);
    const [newLocation, setNewLocation] = useState(location ? location : "");
    const [newPreviewImage, setNewPreviewImage] = useState(preview_image ? preview_image : "");
    const [newPrivacy, setNewPrivacy] = useState(privacy ? privacy : true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);

    const handlePrivacyChange = (e) => {
        setNewPrivacy(e.target.value === 'true');
        setIsDisabled(false);
    };

    useEffect(() => {
        console.log("useeff running")
        console.log("orig date: ", origDate)
        setNewDateHosted(origDate);
    }, [dispatch]);

    const handleSubmit = async (e) => {
        console.log("submitting form")
        e.stopPropagation();
        e.preventDefault();

        setErrors([]);

        const updatedEvent = {
            id: id,
            owner_id: owner_id,
            name: newName,
            description: newDescription,
            location: newLocation,
            date_hosted: newDateHosted,
            preview_image: newPreviewImage,
            tags: tags,
            attendees: attendees,
            privacy: newPrivacy
        }

        let response;

        try {
            response = await dispatch(fetchUpdateEvent(id, updatedEvent));
            if (response && !response.location) {
                setErrors(response);
            } else {
                navigate(`/events/${id}`)
                closeModal();
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="update-event-form-container">
            <h1>Edit Event</h1>
            {errors && Object.keys(errors).length  ? Object.values(errors) : ""}
            <form disabled={isDisabled} onSubmit={handleSubmit}>
                <label htmlFor="name-input">
                    Name
                    <input
                        type="text"
                        placeholder="Pick something catchy"
                        id="name-input"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="description-input">
                    Description
                    <input
                        type="textarea"
                        placeholder="Share some details about your event"
                        id="description-input"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="date-input">
                Date and Time
                    <DateTimePicker
                        id="date-input"
                        value={newDateHosted}
                        onChange={setNewDateHosted}
                        minDate={new Date()}
                        required
                    />
                </label>
                <label htmlFor="location-input">
                    Location
                    <input
                        type="text"
                        placeholder="Street address"
                        id="location-input"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="preview-image-input">
                    Preview Image
                    <input
                        type="text"
                        placeholder="Add a link ending in .jpg or .jpeg"
                        id="preview-image-input"
                        value={newPreviewImage}
                        onChange={(e) => setNewPreviewImage(e.target.value)}
                    />
                </label>
                <p>Privacy</p>
                <label>
                    Private (only guests can view)
                    <input
                    type="radio"
                    value={true}
                    checked={newPrivacy === true}
                    onChange={handlePrivacyChange}
                    />
                </label>
                <label>
                    Public (anyone can view)
                    <input
                    type="radio"
                    value={false}
                    checked={newPrivacy === false}
                    onChange={handlePrivacyChange}
                    />
                </label>
                <button type="submit" disabled={newName.length < 2}>Edit</button>
            </form>
        </div>
    )
}

export default UpdateEventModal;
