import {
  CREATE_CITY,
  GET_ALL_CITIES,
  DELETE_CITY,
  UPDATE_CITY,
} from "../actions/city.action";

const initialsState = {};

export default function cityReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_CITIES:
      return action.payload;
    case CREATE_CITY:
      return { ...state, data: action.payload?.data || null };
    case DELETE_CITY:
      return { ...state, data: action.payload?.data || null };
    case UPDATE_CITY:
      return { ...state, data: action.payload?.data || null };
    default:
      return state;
  }
}

export const selectCities = (state) => state.cityReducer.cities;
