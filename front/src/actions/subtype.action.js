import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_SUBTYPES = "GET_ALL_SUBTYPES";

export const getAllSubtypes = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "subtypes", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_SUBTYPES,
          payload: res.data,
        });
      });
  };
};
