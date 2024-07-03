import axios from "axios";
import { apiUrl } from "../data/data";

export const GET_ALL_STRUCTURES = "GET_ALL_STRUCTURES";

export const getAllStructures = (data) => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "structures", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: GET_ALL_STRUCTURES,
          payload: res.data,
        });
      });
  };
};
