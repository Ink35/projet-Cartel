import {
  CREATE_USER,
  EDIT_PASSWORD_USER,
  EDIT_USER,
  GET_ALL_USERS,
  LOG_IN_USER,
  LOG_OUT,
} from "../actions/auth.action";

const initialState = {
  csrf_token: null,
  data: null,
  connected: false,
};

const getLocalStorageData = () => {
  return {
    csrf_token: localStorage.getItem("csrf_token") || null,
    data: JSON.parse(localStorage.getItem("user")) || null,
    connected: localStorage.getItem("connected") === "true",
  };
};

export default function authReducer(
  state = getLocalStorageData() || initialState,
  action
) {
  switch (action.type) {
    case LOG_IN_USER:
      return { ...state, data: action.payload?.data || null, connected: true };
    case CREATE_USER:
      return {
        ...state,
        create_user: action.payload.user,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        users: action.payload.users,
      };
    case EDIT_USER:
      return {
        ...state,
        eddited_user: action.payload.user,
      };
    case EDIT_PASSWORD_USER:
      return {
        ...state,
        password: action.payload.user,
      };
    case LOG_OUT:
      localStorage.removeItem("user");
      localStorage.removeItem("connected");
      return initialState;
    default:
      return state;
  }
}

export const selectUsers = (state) => state.authReducer.users;
export const selectCurrentUser = (state) => state.authReducer.data;
export const selectIsLoggedIn = (state) => state.authReducer.connected;
