import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteArtiste,
  getAllArtistes,
  updateArtiste,
} from "../actions/artiste.action";
import { selectArtistes } from "../reducers/artiste.reducer";
import { selectDates } from "../reducers/date.reducer";
import { getAllDates } from "../actions/date.action";
import AdminDate from "./AdminDate";

const ArtistesList = () => {
  const dispatch = useDispatch();
  const artistes = useSelector(selectArtistes);
  const dates = useSelector(selectDates);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [artiste_id, setArtiste_id] = useState(null);
  const [artisteUpdateId, setArtisteUpdateId] = useState(null);
  const [artisteNameUpdate, setArtisteNameUpdate] = useState(null);
  const [artisteURLUpdate, setArtisteURLUpdate] = useState(null);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllArtistes());
  }, [dispatch]);

  const indexOfLastArtiste = currentPage * artistesPerPage;
  const indexOfFirstArtiste = indexOfLastArtiste - artistesPerPage;
  const filteredArtistes =
    artistes &&
    artistes.filter((artiste) =>
      artiste.artiste_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentArtistes =
    filteredArtistes &&
    filteredArtistes.slice(indexOfFirstArtiste, indexOfLastArtiste);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <=
    Math.ceil(filteredArtistes && filteredArtistes.length / artistesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdateArtiste = (id, name, url) => {
    setArtisteUpdateId(id);
    setArtisteNameUpdate(name);
    setArtisteURLUpdate(url);
  };

  const handleValidate = () => {
    const newArtiste = new FormData();
    newArtiste.append("artiste_ID", artisteUpdateId);
    newArtiste.append("artiste_name", artisteNameUpdate);
    newArtiste.append("img_url", artisteURLUpdate);
    dispatch(updateArtiste(newArtiste)).then(() => {
      dispatch(getAllArtistes());
      setArtisteUpdateId(null);
    });
  };

  const handleArtisteChange = (value) => {
    setArtisteNameUpdate(value);
  };

  const handleArtisteURLChange = (value) => {
    setArtisteURLUpdate(value);
  };

  const handleDateByArtistes = (id) => {
    setArtiste_id(id);
  };

  const handleDeleteArtiste = (id) => {
    const formArtiste = new FormData();
    formArtiste.append("artiste_ID", id);
    dispatch(deleteArtiste(formArtiste)).then(() => {
      dispatch(getAllArtistes());
    });
  };

  const handleCancel = () => {
    setArtisteUpdateId(null);
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by artiste name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-sm center">
        <thead>
          <tr>
            <th>Artiste</th>
            <th>Photo de profil</th>
            <th className="date-number">Nombre(s) de date</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Date(s)</th>
          </tr>
        </thead>
        <tbody>
          {currentArtistes &&
            currentArtistes.map((artiste) => (
              <tr key={artiste.artiste_ID}>
                {artiste.artiste_ID === artisteUpdateId ? (
                  <input
                    type="text"
                    value={artisteNameUpdate}
                    onChange={(e) => handleArtisteChange(e.target.value)}
                  ></input>
                ) : (
                  <td>{artiste.artiste_name.toUpperCase()}</td>
                )}
                {artiste.artiste_ID === artisteUpdateId ? (
                  <td>
                    <input
                      type="text"
                      value={artisteURLUpdate}
                      onChange={(e) => handleArtisteURLChange(e.target.value)}
                    ></input>
                  </td>
                ) : (
                  <td className="url-table">{artiste.img_url}</td>
                )}

                <td className="date-number">
                  {dates &&
                    dates.length > 0 &&
                    dates.filter(
                      (date) => date.artiste.artiste_ID === artiste.artiste_ID
                    ).length}
                </td>
                <td>
                  {artiste.artiste_ID === artisteUpdateId ? (
                    <>
                      <button
                        type="button"
                        className="btn-classique"
                        onClick={handleValidate}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-classique"
                        onClick={handleCancel}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-classique"
                      onClick={() =>
                        handleUpdateArtiste(
                          artiste.artiste_ID,
                          artiste.artiste_name,
                          artiste.img_url
                        )
                      }
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn-classique"
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-delete-artiste${artiste.artiste_ID}`}
                  >
                    <i className="fa-regular fa-trash-can fa-lg"></i>
                  </button>

                  <div
                    className="modal fade"
                    id={`modal-delete-artiste${artiste.artiste_ID}`}
                    tabIndex="-1"
                    aria-labelledby={`modal-delete-artiste${artiste.artiste_ID}`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id={`modal-delete-artiste${artiste.artiste_ID}`}
                          >
                            {artiste.artiste_name}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          Vous devez supprimer les dates associées avant de
                          supprimer cette ville !<br></br>
                          Nombre de dates restantes :{" "}
                          {dates &&
                            dates.filter(
                              (date) =>
                                date.artiste.artiste_ID === artiste.artiste_ID
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
                                (date) =>
                                  date.artiste.artiste_ID === artiste.artiste_ID
                              ).length !== 0
                            }
                            onClick={() =>
                              handleDeleteArtiste(artiste.artiste_ID)
                            }
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
                    onClick={() => handleDateByArtistes(artiste.artiste_ID)}
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
      {artiste_id !== null && <AdminDate id={artiste_id} type="artiste" />}
    </>
  );
};

export default ArtistesList;
