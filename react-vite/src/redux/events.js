const GET_EVENT = 'events/getEvent';
const GET_ALL_EVENTS = 'events/getAllEvents';
const DELETE_EVENT = 'events/deleteEvent';
const GET_EVENT_IMAGES = 'events/getEventImages';
const GET_USERNAMES = 'events/getUsernames'

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

const initialState = { events: [] };

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
        default:
            return state;
    }
  }

  export default eventsReducer;
