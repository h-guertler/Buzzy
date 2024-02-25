const GET_EVENT = 'events/getEvent';
const GET_ALL_EVENTS = 'events/getAllEvents';
const DELETE_EVENT = 'events/deleteEvent';
const GET_EVENT_IMAGES = 'events/getEventImages';
const GET_USERNAMES = 'events/getUsernames';
const ADD_ATTENDEE = 'events/addAttendee';
const CREATE_EVENT = 'events/createEvent';
const ADD_TAG = 'events/addTag';
const ADD_IMAGE = 'events/addImage';
const DELETE_IMAGE = 'events/deleteImage';
const DELETE_TAG = 'events/deleteTag';
const EDIT_IMAGE = 'events/editImage';
const REMOVE_ATTENDEE = 'events/removeAttendee';
const UPDATE_EVENT = 'events/updateEvent';

const getEvent = (event) => ({
    type: GET_EVENT,
    payload: event
});

const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    payload: events
});

const deleteEvent = (id) => ({
    type: DELETE_EVENT,
    id: id,
});

const getEventImages = (eventImages) => ({
    type: GET_EVENT_IMAGES,
    payload: eventImages
});

const getUsernames = (usernames) => ({
    type: GET_USERNAMES,
    payload: usernames
});

const addAttendee = (attendeeId, reqBody) => ({
    type: ADD_ATTENDEE,
    payload: { attendeeId, reqBody }
})

const createEvent = (event) => ({
    type: CREATE_EVENT,
    payload: event
});

const addTag = (tag) => ({
    type: ADD_TAG,
    payload: tag
});

const addImage = (imageObj) => ({
    type: ADD_IMAGE,
    payload: imageObj
});

const deleteImage = (imageId) => ({
    type: DELETE_IMAGE,
    payload: imageId
});

const deleteTag = (tag, eventId) => ({
    type: DELETE_TAG,
    payload: { tag, eventId }
});

const editImage = (imageId, imageUrl) => ({
    type: EDIT_IMAGE,
    payload: { imageId, imageUrl }
});

const removeAttendee = (eventId, userId, username) => ({
    type: REMOVE_ATTENDEE,
    payload: { eventId, userId, username }
});

const updateEvent = (eventId, event) => ({
    type: UPDATE_EVENT,
    payload: { eventId, event }
});

export const fetchGetEvent = (eventId) => async (dispatch) => {
	const response = await fetch(`/api/events/${eventId}`);
	if (response.ok) {
		const data = await response.json();
        dispatch(getEvent(data));
		if (data.errors) {
			return;
		}
	}
};

export const fetchGetAllEvents = () => async (dispatch) => {
    const response = await fetch(`/api/events/all`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getAllEvents(data));
    } else {
        const data = await response.json();
        return data;
    }
};

export const fetchDeleteEvent = (eventId) => async (dispatch) => {
	const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
	if (response.ok) {
		dispatch(deleteEvent(eventId));
	}
};

export const fetchGetEventImages = (eventId) => async (dispatch) => {
    const response = await fetch(`/api/events/${eventId}/images`);
    if (response.ok) {
		const data = await response.json();
        await dispatch(getEventImages(data));
		if (data.errors) {
			return;
		}
	}
}


export const fetchGetUsernames = (eventId) => async (dispatch) => {
    const response = await fetch(`/api/events/${eventId}/attendees`);
    if (response.ok) {
        const data = await response.json();
        await dispatch(getUsernames(data));
        if (data.errors) {
            return;
        }
    }
}

export const fetchAddAttendee = (eventId, attendeeInfo) => async (dispatch) => {
    const reqBody = { user_info: attendeeInfo }
    const response = await fetch(`/api/events/${eventId}/attendees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        const data = await response.json();
        const newAttendeeId = data.attendees.pop();
        await dispatch(addAttendee(newAttendeeId, reqBody));
        return;
    } else {
        const data = await response.json();
        return data;
    }
}

export const fetchCreateEvent = (event) => async (dispatch) => {
    const { name, description, location, preview_image, date_hosted, privacy } = event;
    const reqBody = {
        name: name,
        description: description,
        location: location,
        date_hosted: date_hosted,
        preview_image: preview_image,
        private: privacy
    }
    const response = await fetch(`/api/events/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(createEvent(data));
        return data;
    } else {
        const data = await response.json();
        return data;
    }
}

export const fetchAddTag = (tag, eventId) => async (dispatch) => {
    const reqBody = { tag: tag }
    const response = await fetch(`/api/events/${eventId}/tags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        const data = await response.json();
        const newTag = data.tags.pop();
        await dispatch(addTag(newTag));
        return data;
    } else {
        const data = await response.json();
        return data;
    }
}

export const fetchAddImage = (imageUrl, eventId) => async (dispatch) => {
    const reqBody = { url: imageUrl }
    const response = await fetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(addImage(data));
        return data;
    } else {
        const data = await response.json();
        return data;
    }
}

export const fetchDeleteImage = (imageId) => async (dispatch) => {
	const response = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
	if (response.ok) {
		await dispatch(deleteImage(imageId));
	} else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Image deletion unsuccessful" }
        }
    }
};

export const fetchDeleteTag = (tag, eventId) => async (dispatch) => {
    const reqBody = { tag: tag };
    const response = await fetch(`/api/events/${eventId}/tags`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        await dispatch(deleteTag(tag, eventId));
    } else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Tag deletion unsuccessful" }
        }
    }
}

export const fetchEditImage = (imageId, url) => async (dispatch) => {
    const reqBody = { url: url };
    const response = await fetch(`/api/images/${imageId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        await dispatch(editImage(imageId, url));
    } else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Image edit unsuccessful" }
        }
    }
}

export const fetchRemoveAttendee = (eventId, userId, username) => async (dispatch) => {
    const reqBody = { deleted_id: userId };
    const response = await fetch(`/api/events/${eventId}/attendees`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        await dispatch(removeAttendee(eventId, userId, username));
    } else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Guest removal unsuccessful" }
        }
    }
}

export const fetchUpdateEvent = (eventId, event) => async (dispatch) => {
    const { name, description, date_hosted, location, preview_image, privacy } = event;
    const reqBody = {
        name: name,
        description: description,
        date_hosted: date_hosted,
        location: location,
        preview_image: preview_image,
        private: privacy
    };

    const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });

    if (response.ok) {
        const data = await response.json();
        await dispatch(updateEvent(eventId, data));
    } else {
        if (response) {
            const data = await response.json();
            return data;
        } else {
            return { "error": "Event edit unsuccessful" }
        }
    }
}

const initialState = { events: [], eventImages: [] };

function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_EVENT: {
            return { ...state, event: action.payload };
        }
        case GET_ALL_EVENTS: {
            return { ...state, events: action.payload };
        }
        case DELETE_EVENT: {
            return { ...state, events: state.events.events.filter(event => event.id != action.id)};
        }
        case GET_EVENT_IMAGES: {
            return { ...state, eventImages: action.payload };
        }
        case GET_USERNAMES: {
            return { ...state, usernames: action.payload };
        }
        case ADD_ATTENDEE: {
            const updatedEvent = {
                ...state.event,
                attendees: [...state.event.attendees, action.payload.attendeeId],
            }
            const updatedUsernames = [...state.usernames, action.payload.reqBody.user_info]
            return { ...state, event: updatedEvent, usernames: updatedUsernames };
        }
        case CREATE_EVENT: {
            const updatedEvents = {events: [...state.events.events, action.payload]};
            let updatedEventAdded = action.payload
            return {
                ...state,
                events: updatedEvents,
                event: updatedEventAdded
            }
        }
        case ADD_TAG: {
            const updatedEventWithTags = {
                ...state.event,
                tags: [...state.event.tags, action.payload]
            };
            return {
                ...state,
                event: updatedEventWithTags
            };
        }
        case ADD_IMAGE: {
            const updatedEventImgs = [...state.eventImages["event images"], action.payload]
            return { ...state, eventImages: updatedEventImgs }
        }
        case DELETE_IMAGE: {
            const updatedEventImgsDeleted = {
                ...state.eventImages,
                "event images": state.eventImages["event images"]?.filter(image => image.id !== action.payload)
            };
            return { ...state, eventImages: updatedEventImgsDeleted };
        }
        case DELETE_TAG: {
            const updatedEventTagDeleted = {
                ...state.event,
                tags: state.event.tags?.filter(tag => tag !== action.payload.tag)
            }
            return {
                ...state,
                event: updatedEventTagDeleted
            }
        }
        case EDIT_IMAGE: {
            const updatedUrl = action.payload.imageUrl;
            const imageId = action.payload.imageId;
            const updatedEventImages = state.eventImages["event images"].map(image => {
                if (image.id === imageId) {
                    return { ...image, url: updatedUrl };
                } else {
                    return image;
                }
            });
            return { ...state, eventImages: { ...state.eventImages, "event images": updatedEventImages } };
        }
        case REMOVE_ATTENDEE: {
            const updatedEventAttendeeDeleted = {
                ...state.event,
                attendees: state.event.attendees?.filter(attendeeId => attendeeId !== action.payload.userId)
            }
            const updatedUsernamesNameRemoved = state.usernames?.filter((username) => username !== action.payload.username)
            return {
                ...state,
                event: updatedEventAttendeeDeleted,
                usernames: updatedUsernamesNameRemoved,
            }
        }
        case UPDATE_EVENT: {
            const updatedEventsArray = state.events.events?.map((event) => {
                if (event.id === action.payload.eventId) {
                    return action.payload.event;
                }
                return event;
            });
            return {
                ...state,
                event: action.payload.event,
                events: updatedEventsArray
            };
        }
        default:
            return state;
    }
  }

  export default eventsReducer;
