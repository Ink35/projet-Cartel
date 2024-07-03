import axios from "axios";
import { apiUrl } from "../data/data";
export const GET_ALL_DATES = "GET_ALL_DATES";
export const CREATE_DATE = "CREATE_DATE";
export const CREATE_DATE_UPDATE = "CREATE_DATE_UPDATE";
export const UPDATE_DATE = "UPDATE_DATE";
export const DELETE_DATE = "DELETE_DATE";

export const getAllDates = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "dates", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_DATES,
          payload: res.data,
        });
      });
  };
};

export const createDate = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createDate", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_DATE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const createDateUpdate = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createDateUpdate", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_DATE_UPDATE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateDate = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "editDate", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_DATE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deleteDate = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteDate", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_DATE,
          payload: res.data,
        });
        return res;
      });
  };
};
