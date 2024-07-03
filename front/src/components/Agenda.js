import { useDispatch, useSelector } from "react-redux";
import { selectDates } from "../reducers/date.reducer";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getAllDates } from "../actions/date.action";
import "../styles/agenda.css";

const Agenda = () => {
  const [datesFiltered, setDatesFiltered] = useState([]);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;
  const dates = useSelector(selectDates);

  useEffect(() => {
    dispatch(getAllDates());
  }, [dispatch]);

  useEffect(() => {
    if (dates && dates.length > 0) {
      const filteredDates = dates.filter(
        (date) => new Date(date.date) >= new Date()
      );
      filteredDates.sort((a, b) => new Date(a.date) - new Date(b.date));
      setDatesFiltered(filteredDates);
    }
  }, [dates]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = datesFiltered.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  return (
    <section className="agenda-cards">
      <h1>AGENDA</h1>
      <ul>
        {currentResults.map((date, index) => {
          const [year, month, day] = date.date.split("-");
          const formattedDate = `${day} ${format(new Date(date.date), "MMM", {
            locale: fr,
          })} ${year}`;

          return (
            <li className="agenda-card" key={index}>
              <p className="date-day">{day}</p>
              <div className="date-bar"></div>
              <div className="date-rest">
                <p className="date-month">
                  {format(new Date(date.date), "MMM", {
                    locale: fr,
                  }).toUpperCase()}
                  <br></br>

                  {year}
                </p>
              </div>
              <article className="bloc-artist">
                <h2>{date.artiste.artiste_name.toUpperCase()}</h2>
                <p>
                  {date.city.city_name} / {date.place.place_name}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
      <div className="agenda-button">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <button
          onClick={nextPage}
          disabled={indexOfLastResult >= datesFiltered.length}
        >
          Suivant
        </button>
      </div>
    </section>
  );
};

export default Agenda;
