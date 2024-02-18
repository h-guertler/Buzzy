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
	}
};

const initialState = { events: [], eventImages: [] };

function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_EVENT:
            return { ...state, event: action.payload };
        case GET_ALL_EVENTS:
            return { ...state, events: action.payload };
        case DELETE_EVENT:
            return { ...state, events: state.events.events.filter(event => event.id != action.id)};
        case GET_EVENT_IMAGES:
            return { ...state, eventImages: action.payload };
        case GET_USERNAMES:
            return { ...state, usernames: action.payload };
        case ADD_ATTENDEE:
            const updatedEvent = {
                ...state.event,
                attendees: [...state.event.attendees, action.payload.attendeeId],
            }
            const updatedUsernames = [...state.usernames, action.payload.reqBody.user_info]
            return { ...state, event: updatedEvent, usernames: updatedUsernames };
        case CREATE_EVENT:
            const updatedEvents = {events: [...state.events.events, action.payload]};
            let updatedEventAdded = action.payload
            return {
                ...state,
                events: updatedEvents,
                event: updatedEventAdded
            }
        case ADD_TAG:
            const updatedEventWithTags = {
                ...state.event,
                tags: [...state.event.tags, action.payload]
            };
            return {
                ...state,
                event: updatedEventWithTags
            };
        case ADD_IMAGE:
            const updatedEventImgs = [...state.eventImages["event images"], action.payload]
            return { ...state, eventImages: updatedEventImgs }
        case DELETE_IMAGE:
            const updatedEventImgsDeleted = {
                ...state.eventImages,
                "event images": state.eventImages["event images"]?.filter(image => image.id !== action.payload)
            };
            return { ...state, eventImages: updatedEventImgsDeleted };
        default:
            return state;
    }
  }

  export default eventsReducer;
