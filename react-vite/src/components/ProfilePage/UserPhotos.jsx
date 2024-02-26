import loadingplaceholderimg from "../../../src/loadingplaceholderimage.png";
import { fetchDeleteImage } from "../../redux/events";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeleteEventImage from "../ConfirmDeleteEventImage";
import EditEventImage from "../EditEventImage";
import { useSelector } from "react-redux";
import "./ProfilePage.css";

const UserPhotos = () => {
    const userImages = useSelector((state) => state.eventimages.userImages ? state.eventimages.userImages : []);
    const imgArray = userImages["event images"];

    const sliceDate = (str) => str.slice(0, 16);

    const recentImgArray = imgArray.toReversed();

    const renderedImages = recentImgArray.map((image) =>(
        <div key={image.id} className="rendered-img-div">
            <img className="image" src={image.url ? image.url : loadingplaceholderimg} alt="event image"/>
            <div className="event-images-buttons-div">
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
            <div className="event-name-div">{image.name}</div>
            <div>{image.created_at ? sliceDate(image.created_at.toString()) : ""}</div>
        </div>
    ));


    return (
        <div className="photos-grid">
            {renderedImages}
        </div>
    )
};

export default UserPhotos;
