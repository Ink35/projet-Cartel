import GoogleCalendar from "./GoogleCalendar";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import Agenda from "./Agenda";
import "../styles/calendar.css";

const Calendar = () => {
  const loggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  if (currentUser && currentUser.role === "booker_ext") {
    return <Navigate to="/mes_bookings" />;
  }

  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }

  return (
    <section className="calendar">
      <GoogleCalendar />
      <Agenda />
    </section>
  );
};

export default Calendar;
