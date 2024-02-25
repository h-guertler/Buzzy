import { useEffect, useState } from "react";
import { fetchGetEvent, fetchGetEventImages, fetchGetUsernames } from "../../redux/events";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddTagModal from "../AddTagModal";
import AddAttendeeModal from "../AddAttendeeModal";
import AddEventImageModal from "../AddEventImageModal";
import ConfirmDeleteTag from "../ConfirmDeleteTag";
import ConfirmDeleteAttendee from "../ConfirmDeleteAttendee";
import OpenModalButton from "../OpenModalButton";

import "./EventDetailPage.css";
import EventImages from "./EventImages";

function EventDetailPage() {
    const { eventId } = useParams();
    const dispatch = useDispatch();

    let [isLoading, setIsLoading] = useState(true)

    const handleButtonClick = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        setIsLoading(true)
        async function fetchEventsWithImages() {
            await dispatch(fetchGetEvent(eventId));
            await dispatch(fetchGetEventImages(eventId));
            await dispatch(fetchGetUsernames(eventId));
            setIsLoading(false)
        }
        fetchEventsWithImages();
    }, [dispatch, eventId]);

    const event = useSelector(state => state.events.event);
    const eventImages = useSelector(state => state.events.eventImages);
    const user = useSelector(state => state.session.user);
    const usernames = useSelector(state => state.events && state.events.usernames ? state.events.usernames : []);
    const ids = useSelector(state => state.events && state.events.event ? state.events.event.attendees : []);

    let [allGuestUsernames, setAllGuestUsernames] = useState([])

    useEffect(() => {
        if (usernames) {
            setAllGuestUsernames(usernames.join(" • "));
        }
    }, [usernames]);


    let previewImage = "";
    event && event.preview_image ? previewImage = event.preview_image : previewImage = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    let tags = "";
    event && event.tags ? tags = event.tags : tags = "";

    let tagString = "";
    if (tags) tagString = tags.join(" • ");

    const deletableTags = event && event.tags ? event.tags.map((tag) => (
        <div id={tag} key={tag} className="item-div">
            {tag}
            <OpenModalButton
                buttonText="X"
                onButtonClick={handleButtonClick}
                className="clickable"
                modalComponent={<ConfirmDeleteTag eventId={eventId} tag={tag}/>}
            />
        </div>
    )) : <div></div>

    const deletableAttendees = usernames.map((username) => (
        <div id={username} key={username} className="item-div">
            {username}
            <OpenModalButton
                buttonText="X"
                onButtonClick={handleButtonClick}
                className="clickable"
                modalComponent={<ConfirmDeleteAttendee username={username} userId={ids[usernames.indexOf(username)]} eventId={eventId}/>}
            />
        </div>
    ));

    const imgArray = eventImages && eventImages["event images"] ? eventImages["event images"] : [];

    const sliceDate = (str) => str.slice(0, 16);

    return (

        <div className="detail-page-div">
            {isLoading ? (
            <h1>Loading...</h1>
        ) : (
            <>
            <div id="image-and-event-info-div">
                <div id="image-date-place-div">
                <h1>{event && event.name ? event.name : ""}</h1>
                    <img className="detailPreviewImg" src={previewImage} alt="event preview image" id="event-preview-image"/>
                    <div id="event-date-hosted">{event && event.date_hosted ? sliceDate(event.date_hosted.toString()) : ""}</div>
                    <div>{event && event.location ? event.location : ""}</div>
                </div>
                <div id="description-div">
                    <h3>About</h3>
                    <p>{event && event.description ? event.description : ""}</p>
                </div>
                <div id="tag-div">
                    <h3>Tags</h3>
                    <p hidden={event && user && user.id === event.owner_id}>{tagString}</p>
                    <div className="deletable-tags" hidden={(!event || !user) || (event && user && (event.owner_id !== user.id))}>
                        <div>{deletableTags}</div>
                    </div>
                    <div hidden={!(event && user && user.id === event.owner_id)} className="modal-div">
                        <OpenModalButton
                            buttonText="Add A Tag"
                            onButtonClick={handleButtonClick}
                            className="clickable"
                            modalComponent={<AddTagModal />}
                        />
                    </div>
                    </div>
            <div id="guest-div">
                <h3>Going</h3>
                <div hidden={!(event && user && event.attendees && (event.attendees.includes(user.id)) && event.owner_id !== user.id)}>
                    {allGuestUsernames}
                </div>
                <div className="deletable-attendees" hidden={(!event || !user) || (event && user && (event.owner_id !== user.id))}>
                    {deletableAttendees}
                </div>
                <div hidden={!(event && user && user.id === event.owner_id)} className="modal-div">
                    <OpenModalButton
                        buttonText="Add a Guest"
                        onButtonClick={handleButtonClick}
                        className="clickable"
                        modalComponent={<AddAttendeeModal />}
                    />
                </div>
                </div>
            </div>
            <div className="add-photos-div">
                {imgArray.length !== 0 && (
                <h2>Photos</h2>
                )}
                {user && user !== null && (event.attendees.includes(user.id) || user.id === event.owner_id) && (
                <OpenModalButton
                    buttonText="Add a Photo"
                    onButtonClick={handleButtonClick}
                    className="clickable"
                    modalComponent={<AddEventImageModal />}
                />
                )}
            </div>
            <div>
                <div className="container-for-photos-grid">
                    <EventImages images={imgArray}/>
                </div>
            </div>
            </>
        )}
        </div>
    )
}

export default EventDetailPage;
