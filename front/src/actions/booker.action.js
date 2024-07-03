import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_BOOKERS = "GET_ALL_BOOKERS";

export const getAllBookers = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "users", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_BOOKERS,
          payload: res.data,
        });
      });
  };
};
