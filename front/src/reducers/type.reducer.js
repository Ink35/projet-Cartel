import { GET_ALL_TYPES } from "../actions/type.action";

const initialsState = {};

export default function typeReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_TYPES:
      return action.payload;
    default:
      return state;
  }
}

export const selectTypes = (state) => state.typeReducer.types;
