import {
  CREATE_DATE,
  CREATE_DATE_UPDATE,
  DELETE_DATE,
  GET_ALL_DATES,
  UPDATE_DATE,
} from "../actions/date.action";
import { UPDATE_CHECKLIST } from "../actions/checklist.action";

const initialState = {};

export default function dateReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_DATES:
      return action.payload;
    case CREATE_DATE:
      return { ...state, newDate: action.payload.newDate };
    case CREATE_DATE_UPDATE:
      return {
        ...state,
        dates: [...state.dates, action.payload.newDate],
      };
    case UPDATE_DATE:
      return {
        ...state,
        dates: state.dates.map((date) =>
          date.date_ID === action.payload.editedDate.date_ID
            ? action.payload.editedDate
            : date
        ),
      };
    case DELETE_DATE:
      return { ...state, deleteDate: action.payload.deleteDate };
    case UPDATE_CHECKLIST:
      return {
        ...state,
        dates: state.dates.map((date) =>
          date.date_ID === action.payload.dateUpdate.date_ID
            ? { ...date, checklist: action.payload.editedChecklist }
            : date
        ),
      };
    default:
      return state;
  }
}

export const selectDates = (state) => state.dateReducer.dates;
