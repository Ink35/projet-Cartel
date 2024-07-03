import CreateUser from "./CreateUser";
import "../styles/admin.css";
import { useState } from "react";
import CitiesList from "./CitiesList";
import PlacesList from "./PlacesList";
import ArtistesList from "./ArtistesList";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ClientsList from "./ClientList";
import AgentsList from "./AgentsList";

const Admin = () => {
  const [actualStatus, setActualStatus] = useState("users");
  const activeUser = useSelector(selectCurrentUser);
  const loggedIn = useSelector(selectIsLoggedIn);
  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }
  if (
    activeUser &&
    activeUser.role !== "admin" &&
    activeUser.role !== "compta" &&
    activeUser.role !== "prod" &&
    activeUser.role !== "dev"
  ) {
    return <Navigate to="/suivi" />;
  }

  function handleClick(status) {
    setActualStatus(status);
  }

  return (
    <>
      <div className="btn-choose">
        <button
          className={`btn-classique ${
            actualStatus === "users" ? "active-admin" : null
          }`}
          onClick={() => handleClick("users")}
        >
          Users <i className="fa-solid fa-user-plus"></i>
        </button>
        <button
          className={`btn-classique ${
            actualStatus === "cities" ? "active-admin" : null
          }`}
          onClick={() => handleClick("cities")}
        >
          Villes <i className="fa-solid fa-city"></i>
        </button>
        <button
          className={`btn-classique ${
            actualStatus === "places" ? "active-admin" : null
          }`}
          onClick={() => handleClick("places")}
        >
          Salles <i className="fa-solid fa-place-of-worship"></i>
        </button>
        <button
          className={`btn-classique ${
            actualStatus === "artistes" ? "active-admin" : null
          }`}
          onClick={() => handleClick("artistes")}
        >
          Artistes <i className="fa-solid fa-guitar"></i>
        </button>
        <button
          className={`btn-classique ${
            actualStatus === "clients" ? "active-admin" : null
          }`}
          onClick={() => handleClick("clients")}
        >
          Clients <i className="fa-solid fa-handshake"></i>
        </button>
        <button
          className={`btn-classique ${
            actualStatus === "agents" ? "active-admin" : null
          }`}
          onClick={() => handleClick("agents")}
        >
          Agents <i className="fa-solid fa-user-tie"></i>
        </button>
      </div>
      {actualStatus === "users" ? <CreateUser /> : null}
      {actualStatus === "cities" ? <CitiesList /> : null}
      {actualStatus === "places" ? <PlacesList /> : null}
      {actualStatus === "artistes" ? <ArtistesList /> : null}
      {actualStatus === "clients" ? <ClientsList /> : null}
      {actualStatus === "agents" ? <AgentsList /> : null}
    </>
  );
};

export default Admin;
