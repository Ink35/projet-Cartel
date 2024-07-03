import axios from "axios";
import { apiUrl } from "../data/data";

export const LOG_IN_USER = "LOG_IN_USER";
export const CREATE_USER = "CREATE_USER";
export const GET_ALL_USERS = "GET_ALL_USERS";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";
export const EDIT_PASSWORD_USER = "EDIT_PASSWORD_USER";
export const LOG_OUT = "LOG_OUT";

export const loginUser = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "login", data, { withCredentials: true })
      .then((res) => {
        const payload = res.data;

        if (payload.connected) {
          dispatch({ type: LOG_IN_USER, payload });
          saveUserToLocalStorage(payload.data);
          localStorage.setItem("connected", true);
        } else {
          throw new Error(payload.message);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        throw error;
      });
  };
};

export const createUser = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "createUser", data, { withCredentials: true })
      .then((res) => {
        dispatch({ type: CREATE_USER, payload: res.data });
        return res;
      });
  };
};

export const getAllUsers = () => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "users", { withCredentials: true })
      .then((res) => {
        dispatch({ type: GET_ALL_USERS, payload: res.data });
        return res;
      });
  };
};

export const editUser = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updateUser", data, { withCredentials: true })
      .then((res) => {
        dispatch({ type: EDIT_USER, payload: res.data });
        return res;
      });
  };
};

export const editPasswordUser = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "updatePassword", data, { withCredentials: true })
      .then((res) => {
        dispatch({ type: EDIT_PASSWORD_USER, payload: res.data });
        return res;
      });
  };
};

export const deleteUser = (data) => {
  return (dispatch) => {
    return axios
      .post(apiUrl + "deleteUser", data, { withCredentials: true })
      .then((res) => {
        dispatch({ type: DELETE_USER, payload: res.data });
        return res;
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    return axios
      .get(apiUrl + "logout", { withCredentials: true })
      .then((res) => {
        dispatch({ type: LOG_OUT, payload: res.data });
      });
  };
};

const saveUserToLocalStorage = (userData) => {
  const existingUserData = JSON.parse(localStorage.getItem("user")) || {};
  const mergedUserData = { ...existingUserData, ...userData };
  localStorage.setItem("user", JSON.stringify(mergedUserData));
};
