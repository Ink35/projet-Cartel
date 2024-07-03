import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePlace,
  getAllPlaces,
  updatePlace,
} from "../actions/place.action";
import { selectPlaces } from "../reducers/place.reducer";
import { selectDates } from "../reducers/date.reducer";
import { getAllDates } from "../actions/date.action";
import TablePlaces from "./tablePlaces";

const PlacesList = () => {
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces);
  const dates = useSelector(selectDates);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [place_id, setPlace_id] = useState(null);
  const [placeUpdateId, setPlaceUpdateId] = useState(null);
  const [placeNameUpdate, setPlaceNameUpdate] = useState(null);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllPlaces());
  }, [dispatch]);

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const filteredPlaces =
    places &&
    places.filter((place) =>
      place.place_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentPlaces =
    filteredPlaces && filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredPlaces && filteredPlaces.length / placesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdatePlace = (id, name) => {
    setPlaceUpdateId(id);
    setPlaceNameUpdate(name);
  };

  const handleValidate = () => {
    const newPlace = new FormData();
    newPlace.append("place_ID", placeUpdateId);
    newPlace.append("place_name", placeNameUpdate);
    dispatch(updatePlace(newPlace)).then(() => {
      dispatch(getAllPlaces());
      setPlaceUpdateId(null);
    });
  };

  const handlePlaceChange = (value) => {
    setPlaceNameUpdate(value);
  };

  const handleDateByPlaces = (id) => {
    setPlace_id(id);
  };

  const handleDeletePlace = (id) => {
    const formPlace = new FormData();
    formPlace.append("place_ID", id);
    dispatch(deletePlace(formPlace)).then(() => {
      dispatch(getAllPlaces());
    });
  };

  const handleCancel = () => {
    setPlaceUpdateId(null);
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Recherche par nom de salle/festival ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-sm center">
        <thead>
          <tr>
            <th>Salle/Festival</th>
            <th>Nombre(s) de date</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Date(s)</th>
          </tr>
        </thead>
        <tbody>
          {currentPlaces &&
            currentPlaces.map((place, index) => (
              <tr key={place.place_ID}>
                {place.place_ID === placeUpdateId ? (
                  <input
                    type="text"
                    value={placeNameUpdate}
                    onChange={(e) => handlePlaceChange(e.target.value)}
                  ></input>
                ) : (
                  <td>{place.place_name}</td>
                )}
                <td>
                  {dates &&
                    dates.length > 0 &&
                    dates.filter(
                      (date) => date.place.place_ID === place.place_ID
                    ).length}
                </td>
                <td>
                  {place.place_ID === placeUpdateId ? (
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
                        handleUpdatePlace(place.place_ID, place.place_name)
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
                    data-bs-target={`#modal-delete-place${place.place_ID}`}
                  >
                    <i className="fa-regular fa-trash-can fa-lg"></i>
                  </button>

                  <div
                    className="modal fade"
                    id={`modal-delete-place${place.place_ID}`}
                    tabIndex="-1"
                    aria-labelledby={`modal-delete-place${place.place_ID}`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id={`modal-delete-place${place.place_ID}`}
                          >
                            {place.place_name}
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
                              (date) => date.place.place_ID === place.place_ID
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
                                (date) => date.place.place_ID === place.place_ID
                              ).length !== 0
                            }
                            onClick={() => handleDeletePlace(place.place_ID)}
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
                    onClick={() => handleDateByPlaces(place.place_ID)}
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
      {place_id !== null && <TablePlaces place_id={place_id} />}
    </>
  );
};

export default PlacesList;
