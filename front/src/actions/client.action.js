import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_CLIENTS = "GET_ALL_CLIENTS";
export const CREATE_CLIENT = "CREATE_CLIENT";
export const UPDATE_CLIENT = "UPDATE_CLIENT";
export const DELETE_CLIENT = "DELETE_CLIENT";

export const getAllClients = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "clients", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_CLIENTS,
          payload: res.data,
        });
      });
  };
};

export const createClient = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createClient", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_CLIENT,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deleteClient = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteClient", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_CLIENT,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateClient = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateClient", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_CLIENT,
          payload: res.data,
        });
        return res;
      });
  };
};
