const GET_USER_IMAGES = 'eventImages/getUserImages';
const DELETE_USER_IMAGE = 'eventImages/deleteUserImage';
const EDIT_USER_IMAGE = 'eventImages/editUserImage';

const getUserImages = (userImages) => ({
    type: GET_USER_IMAGES,
    payload: userImages,
});

const deleteUserImage = (imageId) => ({
    type: DELETE_USER_IMAGE,
    imageId: imageId,
});

const editUserImage = (imageId, imageUrl) => ({
    type: EDIT_USER_IMAGE,
    payload: {imageId, imageUrl}
});


export const fetchGetUserImages = (userId) => async (dispatch) => {
    const response = await fetch (`/api/users/${userId}/eventimages`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserImages(data));
    } else if (response) {
        const data = await response.json();
        return data;
    } else {
        return { "error": "error fetching user images" };
    }
};

export const fetchDeleteUserImage = (imageId) => async (dispatch) => {
    const response = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
	if (response.ok) {
		await dispatch(deleteUserImage(imageId));
	} else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Image deletion unsuccessful" }
        }
    }
};

export const fetchEditUserImage = (imageId, imageUrl) => async (dispatch) => {
    const reqBody = { url: imageUrl };

    const response = await fetch(`/api/images/${imageId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });
    if (response.ok) {
        await dispatch(editUserImage(imageId, imageUrl));
    } else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Image edit unsuccessful" }
        }
    }
}

const initialState = { userImages: {} };

function eventImagesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_IMAGES: {
            return { ...state, userImages: action.payload }
        }
        case DELETE_USER_IMAGE: {
            return { ...state, userImages: state.userImages["event images"].filter(image => image.id != action.imageId)};
        }
        case EDIT_USER_IMAGE: {
            const updatedUrl = action.payload.imageUrl;
            const imageId = action.payload.imageId;

            const updatedUserImages = state.userImages["event images"].map(image => {
                if (image.id === imageId) {
                    return { ...image, url: updatedUrl };
                } else {
                    return image;
                }
            });
            return { ...state, userImages: { ...state.userImages, "event images": updatedUserImages } };
        }
        default:
            return state
    }
}

export default eventImagesReducer;
