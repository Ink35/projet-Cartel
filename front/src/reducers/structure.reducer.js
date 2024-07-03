import { GET_ALL_STRUCTURES } from "../actions/structure.action";

const initialsState = {};

export default function structureReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_STRUCTURES:
      return action.payload;
    default:
      return state;
  }
}

export const selectStructures = (state) => state.structureReducer.structures;
