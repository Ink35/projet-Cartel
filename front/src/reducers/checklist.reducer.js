import {
  CREATE_CHECKLIST,
  DELETE_CHECKLIST,
  GET_ALL_CHECKLIST,
  UPDATE_CHECKLIST,
} from "../actions/checklist.action";

const initialsState = {};

export default function checklistReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_CHECKLIST:
      return action.payload;
    case CREATE_CHECKLIST:
      return { ...state, newChecklist: action.payload.newChecklist };
    case DELETE_CHECKLIST:
      return { ...state, deleteChecklist: action.payload };
    case UPDATE_CHECKLIST:
      return { ...state, updateChecklist: action.payload };
    default:
      return state;
  }
}

export const selectChecklists = (state) => state.checklistReducer.checklist;
export const selectNewChecklist = (state) =>
  state.checklistReducer.newChecklist;
