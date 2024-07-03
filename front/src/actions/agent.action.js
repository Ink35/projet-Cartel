import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_AGENTS = "GET_ALL_AGENTS";
export const CREATE_AGENT = "CREATE_AGENT";
export const DELETE_AGENT = "DELETE_AGENT";
export const UPDATE_AGENT = "UPDATE_AGENT";

export const getAllAgents = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "agents", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_AGENTS,
          payload: res.data,
        });
      });
  };
};

export const createAgent = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createAgent", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_AGENT,
          payload: res.data,
        });
        return res;
      });
  };
};
export const deleteAgent = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteAgent", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_AGENT,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateAgent = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateAgent", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_AGENT,
          payload: res.data,
        });
        return res;
      });
  };
};
