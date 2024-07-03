import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import { logout } from "../actions/auth.action";
import "../styles/header.css";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const loggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [active, setActive] = useState("");

  useEffect(() => {
    // Extrait la partie pertinente de l'URL (par exemple, "/suivi")
    const currentPath = location.pathname.split("/")[1];
    setActive(currentPath || "home"); // Définit "home" si l'URL est "/"
  }, [location]);

  function handleLogout() {
    dispatch(logout());
  }

  function handleClick(option) {
    setActive(option);
  }

  return (
    <>
      <header className="header">
        <figure>
          <NavLink
            onClick={() => handleClick("suivi")}
            to="/suivi"
            title="Suivi"
          >
            <img
              src={process.env.PUBLIC_URL + "/img/logo.png"}
              alt="logo Cartel Concert"
            ></img>
          </NavLink>
        </figure>
        {!loggedIn ? null : (
          <nav>
            <ul>
              {currentUser &&
              (currentUser.role === "booker ext" ||
                currentUser.role === "booker ext") ? null : (
                <li className={active === "suivi" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("suivi")}
                    to="/suivi"
                    title="Suivi"
                  >
                    HOME
                  </NavLink>
                </li>
              )}
              {currentUser &&
              (currentUser.role === "booker ext" ||
                currentUser.role === "booker ext") ? null : (
                <li className={active === "calendrier" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("calendrier")}
                    to="/calendrier"
                    title="Calendrier"
                  >
                    AGENDA
                  </NavLink>
                </li>
              )}

              <li className={active === "add_date" ? "active" : null}>
                <NavLink
                  onClick={() => handleClick("add_date")}
                  to="/add_date"
                  title="Ajouter une Date"
                >
                  AJOUTER UNE DATE
                </NavLink>
              </li>

              {currentUser &&
              (currentUser.role === "prod" || currentUser.role === "dev") ? (
                <li className={active === "checklist" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("checklist")}
                    to="/checklist"
                    title="Checklist"
                  >
                    CHECKLIST
                  </NavLink>
                </li>
              ) : null}
              {currentUser &&
              (currentUser.role !== "prod" || currentUser.role !== "compta") ? (
                <li className={active === "mes_bookings" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("mes_bookings")}
                    to="/mes_bookings"
                    title="Mes Bookings"
                  >
                    MES BOOKINGS
                  </NavLink>
                </li>
              ) : null}
              {currentUser &&
              (currentUser.role === "compta" ||
                currentUser.role === "prod" ||
                currentUser.role === "admin" ||
                currentUser.role === "dev") ? (
                <li className={active === "admin" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("admin")}
                    to="/admin"
                    title="Admin"
                  >
                    ADMIN
                  </NavLink>
                </li>
              ) : null}
              {currentUser &&
              (currentUser.role === "compta" ||
                currentUser.role === "prod" ||
                currentUser.role === "admin" ||
                currentUser.role === "dev") ? (
                <li className={active === "compta" ? "active" : null}>
                  <NavLink
                    onClick={() => handleClick("compta")}
                    to="/compta"
                    title="Compta"
                  >
                    COMPTA
                  </NavLink>
                </li>
              ) : null}
              <li>
                {!loggedIn ? (
                  <NavLink to="/sign_in" title="Sign In">
                    LOGIN
                  </NavLink>
                ) : (
                  <button
                    className="logout"
                    onClick={handleLogout}
                    title="Déconnexion"
                  >
                    LOGOUT
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
