const GET_EVENT = 'events/getEvent';
const GET_ALL_EVENTS = 'events/getAllEvents'

const getEvent = (event) => ({
    type: GET_EVENT,
    payload: event
});

const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    payload: events
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

const initialState = { events: null };

function eventsReducer(state = initialState, action) {
    switch (action.type) {
      case GET_EVENT:
        return { ...state, event: action.payload };
    case GET_ALL_EVENTS:
        return { ...state, events: action.payload };
      default:
        return state;
    }
  }

  export default eventsReducer;
