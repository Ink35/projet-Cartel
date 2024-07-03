import {
  CREATE_AGENT,
  DELETE_AGENT,
  GET_ALL_AGENTS,
  UPDATE_AGENT,
} from "../actions/agent.action";

const initialsState = {};

export default function agentReducer(state = initialsState, action) {
  switch (action.type) {
    case GET_ALL_AGENTS:
      return action.payload;
    case CREATE_AGENT:
      return { ...state, newAgent: action.payload.newAgent };
    case DELETE_AGENT:
      return { ...state, deleteAgent: action.payload };
    case UPDATE_AGENT:
      return { ...state, updateAgent: action.payload };
    default:
      return state;
  }
}

export const selectAgents = (state) => state.agentReducer.agents;
export const selectNewAgent = (state) => state.agentReducer.newAgent;
