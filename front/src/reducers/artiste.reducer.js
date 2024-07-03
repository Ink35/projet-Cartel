import {
  CREATE_ARTISTE,
  DELETE_ARTISTE,
  GET_ALL_ARTISTES,
  UPDATE_ARTISTE,
} from "../actions/artiste.action";

const initialsState = {};

export default function artisteReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_ARTISTES:
      return action.payload;
    case CREATE_ARTISTE:
      return { ...state, newArtiste: action.payload.newArtiste };
    case DELETE_ARTISTE:
      return { ...state, deleteArtiste: action.payload };
    case UPDATE_ARTISTE:
      return { ...state, updateArtiste: action.payload };
    default:
      return state;
  }
}

export const selectArtistes = (state) => state.artisteReducer.artistes;
export const selectNewArtiste = (state) => state.artisteReducer.newArtiste;
