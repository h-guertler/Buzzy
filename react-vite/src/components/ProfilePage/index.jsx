import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchGetUserEvents } from "../../redux/events";
import "./ProfilePage.css";
import UserEvents from "./UserEvents";
import UserPhotos from "./UserPhotos";

function ProfilePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.session.user);
    const username = user && user.username ? user.username : "";

    const [activeTab, setActiveTab] = useState("events");

    useEffect(() => {
        dispatch(fetchGetUserEvents());
    }, [dispatch, userId]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    }

    // Photos

    // should be an events section
    // with event cards for all their events

    // should be a photos section
    // with all their photos
    // Also list the event name??
    // use EventImages.jsx from EventDetailPage

    return (
        <div>
            <h1>{username}</h1>
            <div className="tabs-container">
                <div className="profile-tabs">
                    <div className={`${activeTab === "events" ? 'active' : ''}`} onClick={() => handleTabClick("events")}>
                        Events
                    </div>
                    <div className={`${activeTab === "photos" ? 'active' : ''}`} onClick={() => handleTabClick("photos")}>
                        Photos
                    </div>
                </div>
                <div className="tab-info">
                    {activeTab == "events" && (
                        <UserEvents userId={userId} />
                    )}
                    {activeTab == "photos" && (
                        <UserPhotos userId={userId}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
