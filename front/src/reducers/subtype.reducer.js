import { GET_ALL_SUBTYPES } from "../actions/subtype.action";

const initialsState = {};

export default function subtypeReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_SUBTYPES:
      return action.payload;
    default:
      return state;
  }
}

export const selectSubtypes = (state) => state.subtypeReducer.subtypes;
