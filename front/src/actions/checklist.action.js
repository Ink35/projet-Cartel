import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_CHECKLIST = "GET_ALL_CHECKLIST";
export const CREATE_CHECKLIST = "CREATE_CHECKLIST";
export const DELETE_CHECKLIST = "DELETE_CHECKLIST";
export const UPDATE_CHECKLIST = "UPDATE_CHECKLIST";

export const getAllChecklists = () => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "checklist", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_CHECKLIST,
          payload: res.data,
        });
      });
  };
};

export const createChecklist = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createChecklist", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_CHECKLIST,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deleteChecklist = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteChecklist", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_CHECKLIST,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateChecklist = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateChecklist", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_CHECKLIST,
          payload: res.data,
        });
        return res;
      });
  };
};
