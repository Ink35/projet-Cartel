import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_PLACES = "GET_ALL_PLACES";
export const CREATE_PLACE = "CREATE_PLACE";
export const UPDATE_PLACE = "UPDATE_PLACE";
export const DELETE_PLACE = "DELETE_PLACE";

export const getAllPlaces = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "places", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_PLACES,
          payload: res.data,
        });
      });
  };
};

export const createPlace = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createPlace", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_PLACE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deletePlace = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deletePlace", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_PLACE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updatePlace = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updatePlace", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_PLACE,
          payload: res.data,
        });
        return res;
      });
  };
};
