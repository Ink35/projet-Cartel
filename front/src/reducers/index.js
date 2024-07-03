import { combineReducers } from "redux";
import dateReducer from "./date.reducer";
import artisteReducer from "./artiste.reducer";
import cityReducer from "./city.reducer";
import placeReducer from "./place.reducer";
import typeReducer from "./type.reducer";
import subtypeReducer from "./subtype.reducer";
import structureReducer from "./structure.reducer";
import bookerReducer from "./booker.reducer";
import authReducer from "./auth.reducer";
import agentReducer from "./agent.reducer";
import checklistReducer from "./checklist.reducer";
import factureReducer from "./facture.reducer";
import clientReducer from "./client.reducer";

export default combineReducers({
  dateReducer,
  artisteReducer,
  cityReducer,
  placeReducer,
  typeReducer,
  subtypeReducer,
  structureReducer,
  bookerReducer,
  authReducer,
  agentReducer,
  checklistReducer,
  factureReducer,
  clientReducer,
});
