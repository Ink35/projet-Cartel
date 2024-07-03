import {
  CREATE_CLIENT,
  DELETE_CLIENT,
  GET_ALL_CLIENTS,
  UPDATE_CLIENT,
} from "../actions/client.action";

const initialsState = {};

export default function clientReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_CLIENTS:
      return action.payload;
    case CREATE_CLIENT:
      return { ...state, data: action.payload?.data || null };
    case UPDATE_CLIENT:
      return { ...state, data: action.payload?.data || null };
    case DELETE_CLIENT:
      return { ...state, data: action.payload?.data || null };
    default:
      return state;
  }
}

export const selectClients = (state) => state.clientReducer.clients;
