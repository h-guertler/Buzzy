const GET_USER_IMAGES = 'eventImages/getUserImages';

const getUserImages = (userImages) => ({
    type: GET_USER_IMAGES,
    payload: userImages,
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

const initialState = { userImages: {} };

function eventImagesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_IMAGES: {
            return { ...state, userImages: action.payload }
        }
        default:
            return state
    }
}

export default eventImagesReducer;
