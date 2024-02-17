import React from "react";
import loadingplaceholderimg from "../../../src/loadingplaceholderimage.png";
import "./index.css";

function EventImages (images) {

    const sliceDate = (str) => str.slice(0, 16);

    const imgArray = images["images"];

    const renderedImages = imgArray.reverse().map((image) =>(
        <div key={image.id}>
            <img className="image" src={image.url ? image.url : loadingplaceholderimg} alt="event image"/>
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
