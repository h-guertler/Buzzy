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
        <div key={image.id}>
            <img className="image" src={image.url ? image.url : loadingplaceholderimg} alt="event image"/>
            <div className="event-images-buttons-div"
            hidden={!user || (user && user.id !== image.user_id)}>
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
            <div>{image.created_at ? sliceDate(image.created_at.toString()) : ""}</div>
            <div>{image.username ? image.username : ""}</div>
        </div>
    ));

    return (
        <div>
            {renderedImages}
        </div>
    )
}

export default EventImages;
