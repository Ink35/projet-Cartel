import { useSelector } from "react-redux";
import ResultTableSuivi from "./ResultTableSuivi";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import { Navigate } from "react-router-dom";

const Booker = () => {
  const currentUser = useSelector(selectCurrentUser);
  const loggedIn = useSelector(selectIsLoggedIn);

  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }

  const currentUserFormatted = {
    value: currentUser.user_ID,
    label: currentUser.user_name,
  };

  return (
    <ResultTableSuivi currentBooker={currentUserFormatted} page="booker" />
  );
};

export default Booker;
