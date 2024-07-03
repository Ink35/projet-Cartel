import {
  CREATE_PLACE,
  DELETE_PLACE,
  GET_ALL_PLACES,
  UPDATE_PLACE,
} from "../actions/place.action";

const initialsState = {};

export default function placeReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_PLACES:
      return action.payload;
    case CREATE_PLACE:
      return { ...state, data: action.payload?.data || null };
    case UPDATE_PLACE:
      return { ...state, data: action.payload?.data || null };
    case DELETE_PLACE:
      return { ...state, data: action.payload?.data || null };
    default:
      return state;
  }
}

export const selectPlaces = (state) => state.placeReducer.places;
