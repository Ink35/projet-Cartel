import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_CITIES = "GET_ALL_CITIES";
export const CREATE_CITY = "CREATE_CITY";
export const DELETE_CITY = "DELETE_CITY";
export const UPDATE_CITY = "UPDATE_CITY";

export const getAllCities = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "cities", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_CITIES,
          payload: res.data,
        });
      });
  };
};

export const createCity = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createCity", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_CITY,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deleteCity = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteCity", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_CITY,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateCity = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateCity", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_CITY,
          payload: res.data,
        });
        return res;
      });
  };
};
