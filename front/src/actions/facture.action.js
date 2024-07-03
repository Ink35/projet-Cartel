import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_FACTURES = "GET_ALL_FACTURES";
export const CREATE_FACTURE = "CREATE_FACTURE";
export const UPDATE_FACTURE = "UPDATE_FACTURE";
export const DELETE_FACTURE = "DELETE_FACTURE";

export const getAllFactures = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "factures", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_FACTURES,
          payload: res.data,
        });
      });
  };
};

export const createFacture = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createFacture", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_FACTURE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const deleteFacture = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteFacture", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_FACTURE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateFacture = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateFacture", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_FACTURE,
          payload: res.data,
        });
        return res;
      });
  };
};
