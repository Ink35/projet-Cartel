import { useState } from "react";
import { loginUser } from "../actions/auth.action";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../reducers/auth.reducer";
import "../styles/authentification.css";

const Authentification = () => {
  const [password, setPassword] = useState();
  const [usermail, setUsermail] = useState();
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectIsLoggedIn);
  const [errorMessage, setErrorMessage] = useState();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsermailChange = (event) => {
    setUsermail(event.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const user = new FormData();
    user.append("email", usermail);
    user.append("password", password);
    dispatch(loginUser(user))
      .then(() => {})
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <form onSubmit={handleClick} className="form-auth">
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={usermail}
            onChange={handleUsermailChange}
          ></input>
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          ></input>
          <label htmlFor="floatingPassword">Password</label>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Connexion</button>
      </form>
    </>
  );
};

export default Authentification;
