import { useState, useEffect } from "react";
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
    const [newPrivacy, setNewPrivacy] = useState(privacy ? privacy : false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);

    const handlePrivacyChange = (e) => {
        setNewPrivacy(e.target.value === 'true');
        setIsDisabled(false);
    };

    useEffect(() => {
        setNewDateHosted(origDate);
        // eslint-disable-next-line
    }, [dispatch]);

    const handleSubmit = async (e) => {
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
                <div className="label-div">
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
                </div>
                <div className="label-div description-div">
                <label htmlFor="description-input" id="description-input-label">
                    Description
                </label>
                    <textarea
                        type="textarea"
                        placeholder="Share some details about your event"
                        id="description-input"
                        cols={22}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="label-div date-div">
                <label htmlFor="date-input">
                Date and Time
                </label>
                <div className="customDatePickerWidth">
                    <DateTimePicker
                        id="date-input"
                        value={newDateHosted}
                        onChange={setNewDateHosted}
                        minDate={new Date()}
                        required
                    />
                </div>
                </div>
                <div className="label-div">
                <label htmlFor="location-input">
                    Location
                    <input
                        type="text"
                        placeholder="City, State"
                        id="location-input"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        required
                    />
                </label>
                </div>
                <div className="label-div">
                <label htmlFor="preview-image-input">
                    Preview Image
                    <input
                        type="text"
                        placeholder="Add a link ending in .jpg or .jpeg"
                        id="preview-image-input"
                        value={newPreviewImage}
                        onChange={(e) => setNewPreviewImage(e.target.value)}
                        required
                    />
                </label>
                </div>
                <p id="privacy-para">Privacy</p>
                <div className="label-div radio-div">
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
                </div>
                <button type="submit"
                className={newName.length < 2 ||
                    newDescription.length < 10 ||
                    newDescription.length > 500 ||
                    !newLocation ||
                    !(newPreviewImage.endsWith(".jpeg") || newPreviewImage.endsWith(".jpg"))
                    ? "disabled" : "clickable"}
                disabled={name.length < 2 ||
                    description.length < 10 ||
                    description.length > 500 ||
                    !location ||
                    !(newPreviewImage.endsWith(".jpeg") || newPreviewImage.endsWith(".jpg"))}
                >
                    Edit
                </button>
            </form>
        </div>
    )
}

export default UpdateEventModal;
