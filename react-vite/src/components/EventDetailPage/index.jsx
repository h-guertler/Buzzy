import React, { useEffect, useState } from "react";
import { fetchGetEvent, fetchGetEventImages, fetchGetUsernames } from "../../redux/events";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddTagModal from "../AddTagModal";
import AddAttendeeModal from "../AddAttendeeModal";
import OpenModalButton from "../OpenModalButton";

import "./EventDetailPage.css";
import EventImages from "./EventImages";

function EventDetailPage() {
    const { eventId } = useParams();
    const dispatch = useDispatch();

    let [isLoading, setIsLoading] = useState(true)

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

    console.log("guest usernames: ", allGuestUsernames)

    let previewImage = "";
    event && event.preview_image ? previewImage = event.preview_image : previewImage = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    let tags = "";
    event && event.tags ? tags = event.tags : tags = "";

    let tagString = "";
    if (tags) tagString = tags.join(" • ");

    const imgArray = eventImages && eventImages["event images"] ? eventImages["event images"] : [];

    const sliceDate = (str) => str.slice(0, 16);

    const handleButtonClick = (e) => {
        e.stopPropagation();
    }

    return (

        <div>
            {isLoading ? (
            <h1>Loading...</h1>
        ) : (
            <>
            <img className="detailPreviewImg" src={previewImage} alt="event preview image"/>
            <h1>{event && event.name ? event.name : ""}</h1>
            <div>{event && event.date_hosted ? sliceDate(event.date_hosted.toString()) : ""}</div>
            <div>{event && event.location ? event.location : ""}</div>
            <p>{event && event.description ? event.description : ""}</p>
            <p>{tagString}</p>
            <div hidden={!(event && user && user.id === event.owner_id)}>
                <OpenModalButton
                    buttonText="Add A Tag"
                    onButtonClick={handleButtonClick}
                    className="clickable"
                    modalComponent={<AddTagModal />}
                />
            </div>
            <div hidden={!(event && event.attendees && user && (event.attendees.includes(user.id) || user.id === event.owner_id))}>
                {allGuestUsernames}
            </div>
            <div hidden={!(event && user && user.id === event.owner_id)}>
                <OpenModalButton
                    buttonText="Add a Guest"
                    onButtonClick={handleButtonClick}
                    className="clickable"
                    modalComponent={<AddAttendeeModal/>}
                />
            </div>
            <div>
                <EventImages images={imgArray}/>
            </div>
            </>
        )}
        </div>
    )
}

export default EventDetailPage;