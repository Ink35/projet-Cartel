import axios from "axios";
import { apiUrl } from "../data/data";
export const GET_ALL_TYPES = "GET_ALL_TYPES";

export const getAllTypes = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "types", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_TYPES,
          payload: res.data,
        });
      });
  };
};
