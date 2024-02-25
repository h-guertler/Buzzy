import { useSelector } from "react-redux";
import loadingplaceholderimg from "../../../src/loadingplaceholderimage.png";
import { fetchDeleteImage } from "../../redux/events";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeleteEventImage from "../ConfirmDeleteEventImage";
import EditEventImage from "../EditEventImage";
import "./index.css";

function EventImages (images) {

    const user = useSelector(state => state.session.user);

    const sliceDate = (str) => str.slice(0, 16);

    const imgArray = images["images"];
    const recentImgArray = imgArray.toReversed();

    const renderedImages = recentImgArray.map((image) =>(
        <div key={image.id} className="rendered-img-div">
            <img className="image" src={image.url ? image.url : loadingplaceholderimg} alt="event image"/>
            <div className="event-images-buttons-div"
            hidden={!user || (user && user.id !== image.user_id)}>
            <div className="photo-buttons-div">
            <OpenModalButton
                buttonText="Edit Photo"
                className="clickable"
                modalComponent={<EditEventImage imageId={image.id}/>}
            />
            <OpenModalButton
                buttonText="Delete Photo"
                className="clickable"
                modalComponent={<ConfirmDeleteEventImage eventImageId={image.id} deleteEventImage={fetchDeleteImage}/>}
            />
            </div>
            </div>
            <div>{image.created_at ? sliceDate(image.created_at.toString()) : ""}</div>
            <div className="photo-username-div">{image.username ? image.username : ""}</div>
        </div>
    ));

    return (
        <div className="photos-grid">
            {renderedImages}
        </div>
    )
}

export default EventImages;
