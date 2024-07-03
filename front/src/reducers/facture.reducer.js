import {
  CREATE_FACTURE,
  DELETE_FACTURE,
  GET_ALL_FACTURES,
  UPDATE_FACTURE,
} from "../actions/facture.action";

const initialsState = {};

export default function factureReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_FACTURES:
      return action.payload;
    case CREATE_FACTURE:
      return { ...state, data: action.payload?.data || null };
    case UPDATE_FACTURE:
      return { ...state, data: action.payload?.data || null };
    case DELETE_FACTURE:
      return { ...state, data: action.payload?.data || null };
    default:
      return state;
  }
}

export const selectFactures = (state) => state.factureReducer.factures;
