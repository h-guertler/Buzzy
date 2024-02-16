import React, { useEffect } from "react";
import { fetchGetEvent, fetchGetEventImages } from "../../redux/events";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./EventDetailPage.css";
import EventImages from "./EventImages";

function EventDetailPage() {
    const { eventId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchEventsWithImages() {
            await dispatch(fetchGetEvent(eventId));
            await dispatch(fetchGetEventImages());
        }
        fetchEventsWithImages();
    }, [dispatch, eventId]);

    const event = useSelector(state => state.events.event);
    const eventImages = useSelector(state => state.events.eventImages);

    let previewImage = "";
    event && event.preview_image ? previewImage = event.preview_image : previewImage = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    let tags = "";
    event && event.tags ? tags = event.tags : tags = "";

    let tagString = "";
    if (tags) tagString = tags.join(" • ");

    const sliceDate = (str) => str.slice(0, 16);

    return (
        <div>
            <img className="detailPreviewImg" src={previewImage} alt="event preview image"/>
            <h1>{event && event.name ? event.name : ""}</h1>
            <div>{event && event.date_hosted ? sliceDate(event.date_hosted.toString()) : ""}</div>
            <div>{event && event.location ? event.location : ""}</div>
            <p>{event && event.description ? event.description : ""}</p>
            <p>{tagString}</p>
            <div>
                <EventImages images={eventImages}/>
            </div>
        </div>
    )

    // another div with the photos
        // maybe this should be a separate component?
}

export default EventDetailPage;
