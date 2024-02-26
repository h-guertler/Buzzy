import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchGetUserEvents } from "../../redux/events";
import { fetchGetUserImages } from "../../redux/eventimages";
import "./ProfilePage.css";
import UserEvents from "./UserEvents";
import UserPhotos from "./UserPhotos";

function ProfilePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.session.user);
    const username = user && user.username ? user.username : "";
    const imageArray = useSelector((state) => state.eventimages.userImages["event images"]);
    const imageArrayLength = imageArray && imageArray.length ? imageArray.length : 0;
    const eventArray = useSelector((state) => state.events.events["events"]);
    const eventArrayLength = eventArray && eventArray.length ? eventArray.length : 0;

    const [activeTab, setActiveTab] = useState("events");

    useEffect(() => {
        dispatch(fetchGetUserEvents());
        dispatch(fetchGetUserImages(userId))
    }, [dispatch, userId, imageArrayLength, eventArrayLength]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    }

    return (
        <div>
            <h1>{username}</h1>
            <div className="tabs-container">
                <div className="profile-tabs">
                    <div id="events-tab" className={`clickable tab ${activeTab === "events" ? 'active' : ''}`} onClick={() => handleTabClick("events")}>
                        Events
                    </div>
                    <div id="photos-tab" className={`clickable tab ${activeTab === "photos" ? 'active' : ''}`} onClick={() => handleTabClick("photos")}>
                        Photos
                    </div>
                </div>
                <div className="tab-info">
                    {activeTab == "events" && (
                        <div className="events-div">
                            <UserEvents />
                        </div>
                    )}
                    {activeTab == "photos" && (
                        <UserPhotos />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
