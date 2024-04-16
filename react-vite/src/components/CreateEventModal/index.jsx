import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCreateEvent } from "../../redux/events";
import { useModal } from "../../context/Modal";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

import "./index.css";

function CreateEventModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dateHosted, setDateHosted] = useState(null);
    const [location, setLocation] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [privacy, setPrivacy] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);

    const handlePrivacyChange = (e) => {
        setPrivacy(e.target.value === 'true');
        setIsDisabled(false);
    };

    const handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        setErrors([]);

        const newEvent = {
            name: name,
            description: description,
            location: location,
            date_hosted: dateHosted,
            preview_image: previewImage,
            privacy: privacy
        }

        let response;

        try {
            response = await dispatch(fetchCreateEvent(newEvent));
            if (response && !response.location) {
                setErrors(response);
            } else {
                navigate(`/events/${response.id}`)
                closeModal();
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="form-container">
            <h1>Create Event</h1>
            {errors && Object.keys(errors).length  ? Object.values(errors) : ""}
            <form disabled={isDisabled} onSubmit={handleSubmit} id="create-event-form">
            <div className="label-div">
                <label htmlFor="name-input">
                    Name
                    <input
                        type="text"
                        placeholder="Pick something catchy"
                        id="name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={dateHosted}
                        onChange={setDateHosted}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
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
                    checked={privacy === true}
                    onChange={handlePrivacyChange}
                    />
                </label>
                <label>
                    Public (anyone can view)
                    <input
                    type="radio"
                    value={false}
                    checked={privacy === false}
                    onChange={handlePrivacyChange}
                    />
                </label>
                </div>
                <button
                    type="submit"
                    className={name.length < 2 ||
                        description.length < 10 ||
                        description.length > 500 ||
                        !location ||
                        (previewImage && !(previewImage.endsWith(".jpeg") || previewImage.endsWith(".jpg")))
                        ? "disabled" : "clickable"}
                    disabled={name.length < 2 ||
                        description.length < 10 ||
                        description.length > 500 ||
                        !location ||
                        (previewImage && !(previewImage.endsWith(".jpeg") || previewImage.endsWith(".jpg")))}
                    >
                    Create
                </button>
            </form>
        </div>
    )
}

export default CreateEventModal;
