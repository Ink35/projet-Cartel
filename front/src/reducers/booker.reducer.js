import { GET_ALL_BOOKERS } from "../actions/booker.action";

const initialsState = {};

export default function bookerReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_BOOKERS:
      return action.payload;
    default:
      return state;
  }
}

export const selectBookers = (state) => state.bookerReducer.users;
