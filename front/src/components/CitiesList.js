import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCity, getAllCities, updateCity } from "../actions/city.action";
import { selectCities } from "../reducers/city.reducer";
import { selectDates } from "../reducers/date.reducer";
import { getAllDates } from "../actions/date.action";
import AdminDate from "./AdminDate";

const CitiesList = () => {
  const dispatch = useDispatch();
  const cities = useSelector(selectCities);
  const dates = useSelector(selectDates);
  const [currentPage, setCurrentPage] = useState(1);
  const [citiesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [city_id, setCity_id] = useState(null);
  const [cityUpdateId, setCityUpdateId] = useState(null);
  const [cityNameUpdate, setCityNameUpdate] = useState(null);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllCities());
  }, [dispatch]);

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const filteredCities =
    cities &&
    cities.filter((city) =>
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentCities =
    filteredCities && filteredCities.slice(indexOfFirstCity, indexOfLastCity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCities && filteredCities.length / citiesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdateCity = (id, name) => {
    setCityUpdateId(id);
    setCityNameUpdate(name);
  };

  const handleValidate = () => {
    const newCity = new FormData();
    newCity.append("city_ID", cityUpdateId);
    newCity.append("city_name", cityNameUpdate);
    dispatch(updateCity(newCity)).then(() => {
      dispatch(getAllCities());
      setCityUpdateId(null);
    });
  };

  const handleCityChange = (value) => {
    setCityNameUpdate(value);
  };

  const handleDateByCities = (id) => {
    setCity_id(id);
  };

  const handleDeleteCity = (id) => {
    const formCity = new FormData();
    formCity.append("city_ID", id);
    dispatch(deleteCity(formCity)).then(() => {
      dispatch(getAllCities());
    });
  };

  const handleCancel = () => {
    setCityUpdateId(null);
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Recherche par nom de ville ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-sm center">
        <thead>
          <tr>
            <th>Ville</th>
            <th>Nombre(s) de date</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Date(s)</th>
          </tr>
        </thead>
        <tbody>
          {currentCities &&
            currentCities.map((city, index) => (
              <tr key={city.city_ID}>
                {city.city_ID === cityUpdateId ? (
                  <input
                    type="text"
                    value={cityNameUpdate}
                    onChange={(e) => handleCityChange(e.target.value)}
                  ></input>
                ) : (
                  <td>{city.city_name.toUpperCase()}</td>
                )}
                <td>
                  {dates &&
                    dates.length > 0 &&
                    dates.filter((date) => date.city.city_ID === city.city_ID)
                      .length}
                </td>
                <td>
                  {city.city_ID === cityUpdateId ? (
                    <>
                      <button
                        type="button"
                        className="btn-classique"
                        onClick={handleValidate}
                      >
                        <i class="fa-solid fa-check"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-classique"
                        onClick={handleCancel}
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-classique"
                      onClick={() =>
                        handleUpdateCity(city.city_ID, city.city_name)
                      }
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn-classique"
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-delete-city${city.city_ID}`}
                  >
                    <i className="fa-regular fa-trash-can fa-lg"></i>
                  </button>

                  <div
                    className="modal fade"
                    id={`modal-delete-city${city.city_ID}`}
                    tabIndex="-1"
                    aria-labelledby={`modal-delete-city${city.city_ID}`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id={`modal-delete-city${city.city_ID}`}
                          >
                            {city.city_name}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          Attention - Supprimer une ville supprimera les salles
                          associées ! Vous devez supprimer les dates associées
                          avant de supprimer cette ville !<br></br>
                          Nombre de dates restantes :{" "}
                          {dates &&
                            dates.filter(
                              (date) => date.city.city_ID === city.city_ID
                            ).length}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            disabled={
                              dates &&
                              dates.filter(
                                (date) => date.city.city_ID === city.city_ID
                              ).length !== 0
                            }
                            onClick={() => handleDeleteCity(city.city_ID)}
                            data-bs-dismiss="modal"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    className="btn-classique"
                    onClick={() => handleDateByCities(city.city_ID)}
                  >
                    <i className="fa-regular fa-calendar"></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`btn-classique number ${
                currentPage === number ? "active-admin" : ""
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
      {city_id !== null && <AdminDate id={city_id} type="city" />}
    </>
  );
};

export default CitiesList;
