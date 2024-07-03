import { useSelector } from "react-redux";
import Form from "./Form";
import { selectIsLoggedIn } from "../reducers/auth.reducer";
import { Navigate } from "react-router-dom";
import "../styles/addDate.css";

const AddDatePage = () => {
  const loggedIn = useSelector(selectIsLoggedIn);
  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }
  return (
    <>
      <Form />
    </>
  );
};

export default AddDatePage;
