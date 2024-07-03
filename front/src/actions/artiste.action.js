import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_ARTISTES = "GET_ALL_ARTISTES";
export const CREATE_ARTISTE = "CREATE_ARTISTE";
export const DELETE_ARTISTE = "DELETE_ARTISTE";
export const UPDATE_ARTISTE = "UPDATE_ARTISTE";

export const getAllArtistes = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "artistes", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_ARTISTES,
          payload: res.data,
        });
      });
  };
};

export const createArtiste = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createArtiste", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: CREATE_ARTISTE,
          payload: res.data,
        });
        return res;
      });
  };
};
export const deleteArtiste = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteArtiste", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: DELETE_ARTISTE,
          payload: res.data,
        });
        return res;
      });
  };
};

export const updateArtiste = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateArtiste", data, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: UPDATE_ARTISTE,
          payload: res.data,
        });
        return res;
      });
  };
};
