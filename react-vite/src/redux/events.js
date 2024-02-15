const GET_EVENT = 'events/getEvent';
const GET_ALL_EVENTS = 'events/getAllEvents';
const DELETE_EVENT = 'events/deleteEvent';

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

  export const fetchGetEvent = (eventId) => async (dispatch) => {
	const response = await fetch(`/api/events/${eventId}`);
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(getEvent(data));
	}
};

export const fetchGetAllEvents = () => async (dispatch) => {
	const response = await fetch(`/api/events/all`);
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(getAllEvents(data));
	}
};

export const fetchDeleteEvent = (eventId) => async (dispatch) => {
	const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
	if (response.ok) {
		dispatch(deleteEvent(eventId));
	}
};

const initialState = { events: [] };

function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_EVENT:
            return { ...state, event: action.payload };
        case GET_ALL_EVENTS:
            return { ...state, events: action.payload };
        case DELETE_EVENT:
            return { ...state, events: state.events.events.filter(event => event.id != action.id)}
        default:
            return state;
    }
  }

  export default eventsReducer;
