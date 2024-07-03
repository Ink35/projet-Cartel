import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../reducers/auth.reducer";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDates } from "../actions/date.action";
import { getAllArtistes } from "../actions/artiste.action";
import { selectDates } from "../reducers/date.reducer";
import {
  createFacture,
  deleteFacture,
  getAllFactures,
  updateFacture,
} from "../actions/facture.action";
import { selectFactures } from "../reducers/facture.reducer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { selectClients } from "../reducers/client.reducer";
import { getAllClients } from "../actions/client.action";
import CreatableSelect from "react-select/creatable";
import "../styles/compta.css";

const Compta = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectIsLoggedIn);
  const [loading, setLoading] = useState(true);
  const dates = useSelector(selectDates);
  const factures = useSelector(selectFactures);
  const clients = useSelector(selectClients);
  const [sortedDates, setSortedDates] = useState([]);
  const [noDateFactures, setNoDateFactures] = useState([]);
  const [sortedFactures, setSortedFactures] = useState([]);
  const [showEmptyDates, setShowEmptyDates] = useState(false);
  const [showArchivedInvoices, setShowArchivedInvoices] = useState(false);
  const [displayOnlyDate, setDisplayOnlyDate] = useState(false);
  const [selectedClient, setSelectedClient] = useState(true);
  const [displayModal, setDisplayModal] = useState();
  const [displayModalDate, setDisplayModalDate] = useState();
  const [editId, setEditId] = useState();

  const [newFacture, setNewFacture] = useState({
    date_ID: "",
    artiste_ID: "",
    client_name: "",
    facture_number: null,
    facture_link: "",
    acompte_status: "",
    date_relance: "",
    commentary: "",
    archive_status: "false",
  });

  const [filterDatesOptions, setFilterDatesOptions] = useState({
    artiste: "",
    date: "",
  });
  const [filterFacturesOptions, setFilterFacturesOptions] = useState({
    client: "",
    facture_number: "",
    date_relance: "",
    date: "",
    artiste: "",
  });

  const filteredFactures =
    factures &&
    factures.filter((facture) => {
      // Vérifier si la facture correspond aux critères de filtrage
      const clientNameMatch = facture.client.client_name
        .toLowerCase()
        .includes(filterFacturesOptions.client.toLowerCase());
      const factureNumberMatch = facture.facture_number.includes(
        filterFacturesOptions.facture_number
      );
      const dateRelanceMatch = facture.date_relance.includes(
        filterFacturesOptions.date_relance
      );
      const artisteNameMatch = facture.artiste.artiste_name
        .toLowerCase()
        .includes(filterFacturesOptions.artiste.toLowerCase());

      // Vérifier si la date de la facture correspond au filtre (ou si elle n'est pas définie)
      const dateMatch =
        !facture.date || facture.date.date.includes(filterFacturesOptions.date);

      // Retourner true si tous les critères correspondent
      return (
        clientNameMatch &&
        factureNumberMatch &&
        dateRelanceMatch &&
        artisteNameMatch &&
        dateMatch // Ne pas besoin de vérifier si facture.date est défini
      );
    });

  const filteredDates =
    dates &&
    dates.filter(
      (date) =>
        date.artiste.artiste_name
          .toLowerCase()
          .includes(filterDatesOptions.artiste.toLowerCase()) &&
        date.date.includes(filterDatesOptions.date)
    );

  const clientsOptions =
    clients &&
    clients.map((client) => ({
      value: client.client_ID,
      label: client.client_name,
    }));

  const datesGroupedByArtiste = sortedDates.reduce((acc, date) => {
    const { artiste_ID } = date.artiste;
    if (!acc[artiste_ID]) {
      acc[artiste_ID] = [];
    }
    acc[artiste_ID].push(date);
    return acc;
  }, {});

  const facturesGroupedByDate =
    filteredFactures &&
    filteredFactures.reduce((acc, facture) => {
      const dateID = facture.date?.date_ID || "null";
      const artisteID = facture.artiste.artiste_ID;
      if (dateID === "null") {
        if (!acc[`null-${artisteID}`]) {
          acc[`null-${artisteID}`] = [];
        }
        acc[`null-${artisteID}`].push(facture);
      } else {
        if (!acc[dateID]) {
          acc[dateID] = [];
        }
        acc[dateID].push(facture);
      }
      return acc;
    }, {});

  const handleToggleChange = () => {
    setShowEmptyDates(!showEmptyDates);
  };

  const handleDisplayOnlyDate = () => {
    setDisplayOnlyDate(!displayOnlyDate);
  };

  const handleToggleArchivedChange = () => {
    setShowArchivedInvoices(!showArchivedInvoices);
  };

  const handleChange = (type, event) => {
    setNewFacture((prevFacture) => ({
      ...prevFacture,
      [type]: event.target.value,
    }));
  };

  const handleNewFacture = (date_ID) => {
    const formFacture = new FormData();
    formFacture.append("date_ID", date_ID);
    formFacture.append("client_name", selectedClient.label);
    formFacture.append("artiste_ID", newFacture.artiste_ID);
    formFacture.append("facture_number", newFacture.facture_number);
    formFacture.append("facture_link", newFacture.facture_link);
    formFacture.append("acompte_status", newFacture.acompte_status);
    formFacture.append("date_relance", newFacture.date_relance);
    formFacture.append("commentary", newFacture.commentary);
    formFacture.append("archive_status", newFacture.archive_status);
    dispatch(createFacture(formFacture)).then((res) => {
      dispatch(getAllFactures());
    });
    setNewFacture({
      date_ID: "",
      artiste_ID: "",
      client_name: "",
      facture_number: null,
      facture_link: "",
      acompte_status: "",
      date_relance: "",
      commentary: "",
      archive_status: "false",
    });
  };

  const handleNewFactureArtiste = (artiste_ID) => {
    const formFacture = new FormData();
    formFacture.append("client_name", selectedClient.label);
    formFacture.append("artiste_ID", artiste_ID);
    formFacture.append("facture_number", newFacture.facture_number);
    formFacture.append("facture_link", newFacture.facture_link);
    formFacture.append("acompte_status", newFacture.acompte_status);
    formFacture.append("date_relance", newFacture.date_relance);
    formFacture.append("commentary", newFacture.commentary);
    formFacture.append("archive_status", newFacture.archive_status);
    dispatch(createFacture(formFacture)).then((res) => {
      dispatch(getAllFactures());
    });
    setNewFacture({
      date_ID: "",
      artiste_ID: "",
      client_name: "",
      facture_number: "",
      facture_link: "",
      acompte_status: "",
      date_relance: "",
      commentary: "",
      archive_status: "false",
    });
  };

  const handleOutArchive = (facture_ID) => {
    const factureEdit = factures.find(
      (facture) => facture.facture_ID === facture_ID
    );
    const formFacture = new FormData();
    formFacture.append("facture_ID", factureEdit.facture_ID);
    if (factureEdit.date && factureEdit.date.date_ID) {
      formFacture.append("date_ID", factureEdit.date.date_ID);
    }
    formFacture.append("client_ID", factureEdit.client.client_ID);
    formFacture.append("artiste_ID", factureEdit.artiste.artiste_ID);
    formFacture.append("facture_number", factureEdit.facture_number);
    formFacture.append("facture_link", factureEdit.facture_link);
    formFacture.append("acompte_status", factureEdit.acompte_status);
    formFacture.append("date_relance", factureEdit.date_relance);
    formFacture.append("commentary", factureEdit.commentary);
    formFacture.append("archive_status", false);
    dispatch(updateFacture(formFacture)).then((res) => {
      dispatch(getAllFactures());
    });
  };

  const handleArchive = (facture_ID) => {
    const factureEdit = factures.find(
      (facture) => facture.facture_ID === facture_ID
    );
    const formFacture = new FormData();
    formFacture.append("facture_ID", factureEdit.facture_ID);
    if (factureEdit.date && factureEdit.date.date_ID) {
      formFacture.append("date_ID", factureEdit.date.date_ID);
    }
    formFacture.append("client_ID", factureEdit.client.client_ID);
    formFacture.append("artiste_ID", factureEdit.artiste.artiste_ID);
    formFacture.append("facture_number", factureEdit.facture_number);
    formFacture.append("facture_link", factureEdit.facture_link);
    formFacture.append("acompte_status", factureEdit.acompte_status);
    formFacture.append("date_relance", factureEdit.date_relance);
    formFacture.append("commentary", factureEdit.commentary);
    formFacture.append("archive_status", true);
    dispatch(updateFacture(formFacture)).then((res) => {
      dispatch(getAllFactures());
    });
  };

  const handleEditFacture = (type, value, facture_ID) => {
    const factureEdit = factures.find(
      (facture) => facture.facture_ID === facture_ID
    );
    const formFacture = new FormData();
    formFacture.append("facture_ID", factureEdit.facture_ID);
    if (factureEdit.date && factureEdit.date.date_ID) {
      formFacture.append("date_ID", factureEdit.date.date_ID);
    }
    if (type === "client_name") {
      formFacture.append("client_name", value);
    } else {
      formFacture.append("client_ID", factureEdit.client.client_ID);
    }
    formFacture.append("artiste_ID", factureEdit.artiste.artiste_ID);
    formFacture.append("facture_number", factureEdit.facture_number);
    formFacture.append("facture_link", factureEdit.facture_link);
    formFacture.append("acompte_status", factureEdit.acompte_status);
    formFacture.append("date_relance", factureEdit.date_relance);
    formFacture.append("commentary", factureEdit.commentary);
    formFacture.append("archive_status", factureEdit.archive_status);
    formFacture.set(type, value);
    dispatch(updateFacture(formFacture)).then((res) => {
      dispatch(getAllFactures());
    });
    setEditId(null);
  };

  const handleSelectEditFacture = (type, facture_ID) => {
    const factureEdit = factures.find(
      (facture) => facture.facture_ID === facture_ID
    );
    setNewFacture((prevFacture) => ({
      ...prevFacture,
      [type]: factureEdit[type],
    }));
    setSelectedClient({
      value: factureEdit.client.client_ID,
      label: factureEdit.client.client_name,
    });
    setEditId(`${type}_${facture_ID}`);
  };

  const handleSelectCLientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handleDeleteFacture = (facture_ID) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette facture ?"
    );
    if (confirmed) {
      const formFacture = new FormData();
      formFacture.append("facture_ID", facture_ID);
      dispatch(deleteFacture(formFacture)).then(() => {
        dispatch(getAllFactures());
      });
    }
  };

  const handleMouseEnterDate = (date_ID) => {
    setDisplayModalDate(date_ID);
  };

  const handleMouseEnterArtiste = (artiste_ID) => {
    setDisplayModal(artiste_ID);
  };
  const handleArtisteID = (artiste_ID, date_ID) => {
    setNewFacture((prevFacture) => ({
      ...prevFacture,
      artiste_ID: artiste_ID,
    }));
  };

  // const dateHasArchivedFactures = (dateID) => {
  //   const factures = facturesGroupedByDate[dateID];
  //   if (factures) {
  //     return factures.some((facture) => facture.archive_status === "true");
  //   }
  //   return false;
  // };

  const artisteHasFactures = (artisteID) => {
    return (
      facturesGroupedByDate[`null-${artisteID}`] ||
      datesGroupedByArtiste[artisteID]?.some(
        (date) => facturesGroupedByDate[date.date_ID]
      )
    );
  };

  const artisteHasDateFactures = (artiste_ID, archiveStatus = "false") => {
    const factures = sortedFactures.filter(
      (facture) => facture.artiste.artiste_ID === artiste_ID
    );
    if (factures) {
      return factures.some(
        (facture) => facture.archive_status === archiveStatus
      );
    }
    return false;
  };

  const artisteHasNoDateActiveFactures = (artiste_ID) => {
    const factures = noDateFactures.filter(
      (facture) => facture.artiste.artiste_ID === artiste_ID
    );
    if (factures) {
      return factures.some((facture) => facture.archive_status === "false");
    }
    return false;
  };

  const artisteHasNonArchivedFacture = (artiste_ID) => {
    const factures = noDateFactures.filter(
      (facture) => facture.artiste.artiste_ID === artiste_ID
    );
    if (factures) {
      return factures.some((facture) => facture.archive_status === "true");
    }
    return false;
  };

  // const artisteHasNoDatesFactures = (artiste_ID) => {
  //   const facture = noDateFactures.filter(
  //     (facture) => facture.artiste.artiste_ID === artiste_ID
  //   );
  //   return factures && factures.length > 0;
  // };

  const dateHasNonArchivedFactures = (dateID) => {
    const factures = facturesGroupedByDate[dateID];
    if (factures) {
      return factures.some((facture) => facture.archive_status === "false");
    }
    return false;
  };

  const dateHasFactures = (dateID) => {
    const factures = facturesGroupedByDate[dateID];
    return factures && factures.length > 0;
  };

  useEffect(() => {
    setLoading(true);

    const promises = [
      dispatch(getAllDates()),
      dispatch(getAllArtistes()),
      dispatch(getAllFactures()),
      dispatch(getAllClients()),
    ];

    Promise.all(promises)
      .then(() => setLoading(false))
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors du chargement des données :",
          error
        );
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (filteredDates && filteredDates.length > 0) {
      const sortedData = [...filteredDates].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSortedDates(sortedData);
    }
  }, [filterDatesOptions, dates]);

  useEffect(() => {
    if (filteredFactures && filteredFactures.length > 0) {
      // Filtrer les factures en fonction de showArchivedInvoices
      const filteredData = filteredFactures.filter(
        (facture) => showArchivedInvoices || facture.archive_status === "false"
      );

      // Séparer les factures sans date définie
      const noDate = filteredData.filter((facture) => !facture.date?.date);
      setNoDateFactures(noDate);

      // Trier les factures par date
      const sortedData = filteredData
        .filter((facture) => facture.date?.date) // Exclure les factures sans date
        .sort((a, b) => {
          const dateA = new Date(a.date.date);
          const dateB = new Date(b.date.date);
          return dateA - dateB;
        });

      // Mettre à jour l'état avec les factures triées
      setSortedFactures(sortedData);
    } else {
      setSortedFactures([]);
      setNoDateFactures([]);
    }
  }, [filterFacturesOptions, showArchivedInvoices, factures]);

  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }

  if (loading) {
    return (
      <div className="loading-logo">
        <img
          src={process.env.PUBLIC_URL + "/img/logo-loading.gif"}
          alt="loading screen"
        />
      </div>
    );
  }

  function formatFrenchDate(dateString) {
    const dateObject = new Date(dateString);
    return format(dateObject, "dd MMMM yyyy", { locale: fr });
  }

  return (
    <>
      <section className="search-facture">
        <article>
          <h3>Filtre</h3>
          <div className="form-check">
            <input
              className="form-check-input"
              id="displayOnlyDate"
              type="checkbox"
              checked={displayOnlyDate}
              onChange={handleDisplayOnlyDate}
            />
            <label htmlFor="displayOnlyDate">Afficher Checklist</label>
          </div>
          {displayOnlyDate ? null : (
            <div className="form-check">
              <input
                id="showEmptyDates"
                className="form-check-input"
                type="checkbox"
                checked={showEmptyDates}
                onChange={handleToggleChange}
              />
              <label htmlFor="showEmptyDates">
                Afficher les dates sans facture
              </label>
            </div>
          )}
          <div className="form-check">
            <input
              id="showArchivedInvoices"
              className="form-check-input"
              type="checkbox"
              checked={showArchivedInvoices}
              onChange={handleToggleArchivedChange}
            />
            <label htmlFor="showArchivedInvoices">
              Afficher les factures archivées
            </label>
          </div>
        </article>
        {displayOnlyDate ? null : (
          <article className="filter-date-box">
            <h3>Filtre Date/Artiste</h3>

            <div>
              <input
                type="text"
                value={filterDatesOptions.date}
                onChange={(e) =>
                  setFilterDatesOptions({
                    ...filterDatesOptions,
                    date: e.target.value,
                  })
                }
                placeholder="Rechercher par date"
              />
            </div>
            <div>
              <input
                type="text"
                value={filterDatesOptions.artiste}
                onChange={(e) =>
                  setFilterDatesOptions({
                    ...filterDatesOptions,
                    artiste: e.target.value,
                  })
                }
                placeholder="Rechercher par artiste"
              />
            </div>
          </article>
        )}

        <article className="filter-facture-box">
          <h3>Filtre Facture</h3>

          <div className="filtre-facture">
            {displayOnlyDate ? (
              <>
                <div>
                  <input
                    type="text"
                    value={filterFacturesOptions.date}
                    onChange={(e) =>
                      setFilterFacturesOptions({
                        ...filterFacturesOptions,
                        date: e.target.value,
                      })
                    }
                    placeholder="Rechercher par Date"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={filterFacturesOptions.artiste}
                    onChange={(e) =>
                      setFilterFacturesOptions({
                        ...filterFacturesOptions,
                        artiste: e.target.value,
                      })
                    }
                    placeholder="Rechercher par Artiste"
                  />
                </div>
              </>
            ) : null}

            <div>
              <input
                type="text"
                value={filterFacturesOptions.facture_number}
                onChange={(e) =>
                  setFilterFacturesOptions({
                    ...filterFacturesOptions,
                    facture_number: e.target.value,
                  })
                }
                placeholder="Rechercher par n°facture"
              />
            </div>
            <div>
              <input
                type="text"
                value={filterFacturesOptions.date_relance}
                onChange={(e) =>
                  setFilterFacturesOptions({
                    ...filterFacturesOptions,
                    date_relance: e.target.value,
                  })
                }
                placeholder="Rechercher par date de relance"
              />
            </div>
            <div>
              <input
                type="text"
                value={filterFacturesOptions.client}
                onChange={(e) =>
                  setFilterFacturesOptions({
                    ...filterFacturesOptions,
                    client: e.target.value,
                  })
                }
                placeholder="Rechercher par Client"
              />
            </div>
          </div>
        </article>
      </section>
      {displayOnlyDate ? (
        <>
          <table className="table table-sm table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th className="col-relance">Date</th>
                <th className="col-artiste">Artiste</th>
                <th className="col-client">Client</th>
                <th className="col-facture">N°Facture</th>
                <th className="col-link">Lien Facture</th>
                <th className="col-acompte">Acompte</th>
                <th className="col-relance">Date Relance</th>
                <th className="col-com">Commentaire</th>
                <th className="col-archive">Archivé ?</th>
                <th className="col-delete"></th>
              </tr>
            </thead>
            <tbody>
              {sortedFactures &&
                sortedFactures.map((facture, index) => (
                  <tr key={index}>
                    <td className="col-relance">
                      {formatFrenchDate(facture.date.date)}
                    </td>
                    <td className="col-artiste">
                      {facture.artiste.artiste_name}
                    </td>
                    {editId === `client_name_${facture.facture_ID}` ? (
                      <td>
                        <CreatableSelect
                          className="special-width"
                          id={`client_name_${facture.facture_ID}`}
                          isClearable
                          value={selectedClient}
                          onChange={handleSelectCLientChange}
                          options={clientsOptions}
                          placeholder="Sélectionner un client"
                        />
                        <button
                          className="btn-classique"
                          onClick={() =>
                            handleEditFacture(
                              "client_name",
                              selectedClient.label,
                              facture.facture_ID
                            )
                          }
                        >
                          Confirmer
                        </button>
                      </td>
                    ) : (
                      <td
                        className="col-client"
                        onClick={() => {
                          handleSelectEditFacture(
                            "client_name",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `client_name_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.client.client_name}
                      </td>
                    )}

                    {editId === `facture_number_${facture.facture_ID}` ? (
                      <td className="col-facture">
                        <input
                          id={`facture_number_${facture.facture_ID}`}
                          value={newFacture.facture_number}
                          onChange={(event) =>
                            handleChange("facture_number", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "facture_number",
                              newFacture.facture_number,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "facture_number",
                                newFacture.facture_number,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-facture"
                        onClick={() => {
                          handleSelectEditFacture(
                            "facture_number",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `facture_number_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.facture_number}
                      </td>
                    )}

                    {editId === `facture_link_${facture.facture_ID}` ? (
                      <td className="col-link">
                        <input
                          id={`facture_link_${facture.facture_ID}`}
                          value={newFacture.facture_link}
                          onChange={(event) =>
                            handleChange("facture_link", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "facture_link",
                              newFacture.facture_link,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "facture_link",
                                newFacture.facture_link,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td className="col-link facture_link">
                        <a
                          href={facture.facture_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Voir
                        </a>
                        <i
                          onClick={() => {
                            handleSelectEditFacture(
                              "facture_link",
                              facture.facture_ID
                            );
                            setTimeout(() => {
                              const input = document.getElementById(
                                `facture_link_${facture.facture_ID}`
                              );
                              if (input) input.focus();
                            }, 0);
                          }}
                          className="fa-solid fa-pencil cursor"
                        ></i>
                      </td>
                    )}

                    {editId === `acompte_status_${facture.facture_ID}` ? (
                      <td className="col-acompte">
                        <input
                          id={`acompte_status_${facture.facture_ID}`}
                          value={newFacture.acompte_status}
                          onChange={(event) =>
                            handleChange("acompte_status", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "acompte_status",
                              newFacture.acompte_status,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "acompte_status",
                                newFacture.acompte_status,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className={`col-acompte ${
                          facture.acompte_status.includes("OK")
                            ? "table-success"
                            : ""
                        }`}
                        onClick={() => {
                          handleSelectEditFacture(
                            "acompte_status",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `acompte_status_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.acompte_status}
                      </td>
                    )}
                    {editId === `date_relance_${facture.facture_ID}` ? (
                      <td className="col-relance">
                        <input
                          id={`date_relance_${facture.facture_ID}`}
                          value={newFacture.date_relance}
                          onChange={(event) =>
                            handleChange("date_relance", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "date_relance",
                              newFacture.date_relance,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "date_relance",
                                newFacture.date_relance,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-relance"
                        onClick={() => {
                          handleSelectEditFacture(
                            "date_relance",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `date_relance_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.date_relance}
                      </td>
                    )}
                    {editId === `commentary_${facture.facture_ID}` ? (
                      <td className="col-com">
                        <input
                          id={`commentary_${facture.facture_ID}`}
                          value={newFacture.commentary}
                          onChange={(event) =>
                            handleChange("commentary", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "commentary",
                              newFacture.commentary,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "commentary",
                                newFacture.commentary,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-com"
                        onClick={() => {
                          handleSelectEditFacture(
                            "commentary",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `commentary_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.commentary}
                      </td>
                    )}
                    <td className="center col-archive">
                      {facture.archive_status === "true" ? (
                        <i
                          onClick={() => handleOutArchive(facture.facture_ID)}
                          className="fa-solid fa-box-archive cursor"
                        ></i>
                      ) : (
                        <i
                          onClick={() => handleArchive(facture.facture_ID)}
                          className="fa-regular fa-folder-open cursor"
                        ></i>
                      )}
                    </td>
                    <td className="trash-can col-delete">
                      <i
                        onClick={() => handleDeleteFacture(facture.facture_ID)}
                        className="fa-solid fa-trash cursor trash"
                      ></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <h2>Factures sans date associée</h2>
          <table className="table table-sm table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th className="col-artiste">Artiste</th>
                <th className="col-client">Client</th>
                <th className="col-facture">N°Facture</th>
                <th className="col-link">Lien Facture</th>
                <th className="col-acompte">Acompte</th>
                <th className="col-relance">Date Relance</th>
                <th className="col-com">Commentaire</th>
                <th className="col-archive">Archivé ?</th>
                <th className="col-delete"></th>
              </tr>
            </thead>
            <tbody>
              {noDateFactures &&
                noDateFactures.map((facture, index) => (
                  <tr key={index}>
                    <td className="col-artiste">
                      {facture.artiste.artiste_name}
                    </td>
                    {editId === `client_name_${facture.facture_ID}` ? (
                      <td>
                        <CreatableSelect
                          className="special-width"
                          id={`client_name_${facture.facture_ID}`}
                          isClearable
                          value={selectedClient}
                          onChange={handleSelectCLientChange}
                          options={clientsOptions}
                          placeholder="Sélectionner un client"
                        />
                        <button
                          className="btn-classique"
                          onClick={() =>
                            handleEditFacture(
                              "client_name",
                              selectedClient.label,
                              facture.facture_ID
                            )
                          }
                        >
                          Confirmer
                        </button>
                      </td>
                    ) : (
                      <td
                        className="col-client"
                        onClick={() => {
                          handleSelectEditFacture(
                            "client_name",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `client_name_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.client.client_name}
                      </td>
                    )}

                    {editId === `facture_number_${facture.facture_ID}` ? (
                      <td className="col-facture">
                        <input
                          id={`facture_number_${facture.facture_ID}`}
                          value={newFacture.facture_number}
                          onChange={(event) =>
                            handleChange("facture_number", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "facture_number",
                              newFacture.facture_number,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "facture_number",
                                newFacture.facture_number,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-facture"
                        onClick={() => {
                          handleSelectEditFacture(
                            "facture_number",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `facture_number_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.facture_number}
                      </td>
                    )}

                    {editId === `facture_link_${facture.facture_ID}` ? (
                      <td className="col-link">
                        <input
                          id={`facture_link_${facture.facture_ID}`}
                          value={newFacture.facture_link}
                          onChange={(event) =>
                            handleChange("facture_link", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "facture_link",
                              newFacture.facture_link,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "facture_link",
                                newFacture.facture_link,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td className="col-link facture_link">
                        <a
                          href={facture.facture_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Voir
                        </a>
                        <i
                          onClick={() => {
                            handleSelectEditFacture(
                              "facture_link",
                              facture.facture_ID
                            );
                            setTimeout(() => {
                              const input = document.getElementById(
                                `facture_link_${facture.facture_ID}`
                              );
                              if (input) input.focus();
                            }, 0);
                          }}
                          className="fa-solid fa-pencil cursor"
                        ></i>
                      </td>
                    )}

                    {editId === `acompte_status_${facture.facture_ID}` ? (
                      <td className="col-acompte">
                        <input
                          id={`acompte_status_${facture.facture_ID}`}
                          value={newFacture.acompte_status}
                          onChange={(event) =>
                            handleChange("acompte_status", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "acompte_status",
                              newFacture.acompte_status,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "acompte_status",
                                newFacture.acompte_status,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className={`col-acompte ${
                          facture.acompte_status.includes("OK")
                            ? "table-success"
                            : ""
                        }`}
                        onClick={() => {
                          handleSelectEditFacture(
                            "acompte_status",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `acompte_status_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.acompte_status}
                      </td>
                    )}
                    {editId === `date_relance_${facture.facture_ID}` ? (
                      <td className="col-relance">
                        <input
                          id={`date_relance_${facture.facture_ID}`}
                          value={newFacture.date_relance}
                          onChange={(event) =>
                            handleChange("date_relance", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "date_relance",
                              newFacture.date_relance,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "date_relance",
                                newFacture.date_relance,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-relance"
                        onClick={() => {
                          handleSelectEditFacture(
                            "date_relance",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `date_relance_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.date_relance}
                      </td>
                    )}
                    {editId === `commentary_${facture.facture_ID}` ? (
                      <td className="col-com">
                        <input
                          id={`commentary_${facture.facture_ID}`}
                          value={newFacture.commentary}
                          onChange={(event) =>
                            handleChange("commentary", event)
                          }
                          onBlur={() =>
                            handleEditFacture(
                              "commentary",
                              newFacture.commentary,
                              facture.facture_ID
                            )
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleEditFacture(
                                "commentary",
                                newFacture.commentary,
                                facture.facture_ID
                              );
                            }
                          }}
                        ></input>
                      </td>
                    ) : (
                      <td
                        className="col-com"
                        onClick={() => {
                          handleSelectEditFacture(
                            "commentary",
                            facture.facture_ID
                          );
                          setTimeout(() => {
                            const input = document.getElementById(
                              `commentary_${facture.facture_ID}`
                            );
                            if (input) input.focus();
                          }, 0);
                        }}
                      >
                        {facture.commentary}
                      </td>
                    )}
                    <td className="center col-archive">
                      {facture.archive_status === "true" ? (
                        <i
                          onClick={() => handleOutArchive(facture.facture_ID)}
                          className="fa-solid fa-box-archive cursor"
                        ></i>
                      ) : (
                        <i
                          onClick={() => handleArchive(facture.facture_ID)}
                          className="fa-regular fa-folder-open cursor"
                        ></i>
                      )}
                    </td>
                    <td className="trash-can col-delete">
                      <i
                        onClick={() => handleDeleteFacture(facture.facture_ID)}
                        className="fa-solid fa-trash cursor trash"
                      ></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="container">
            {Object.keys(datesGroupedByArtiste)
              .filter(
                (artisteID) => showEmptyDates || artisteHasFactures(artisteID)
              )
              .map((artisteID, index) => {
                const artisteDates = datesGroupedByArtiste[artisteID];
                const artiste =
                  artisteDates && artisteDates[0]
                    ? artisteDates[0].artiste
                    : null;

                if (!artiste) return null;

                const hasActiveFactures = artisteHasDateFactures(
                  artiste.artiste_ID,
                  "false"
                );
                const hasArchivedFactures = artisteHasDateFactures(
                  artiste.artiste_ID,
                  "true"
                );
                const hasNoDateActiveFactures = artisteHasNoDateActiveFactures(
                  artiste.artiste_ID
                );
                const hasNoDateArchivedFactures = dateHasNonArchivedFactures(
                  artiste.artiste_ID
                );

                const shouldShowArtiste =
                  hasActiveFactures ||
                  hasNoDateActiveFactures ||
                  (hasArchivedFactures && showArchivedInvoices) ||
                  (hasNoDateArchivedFactures && showArchivedInvoices) ||
                  showEmptyDates;

                return shouldShowArtiste ? (
                  <div key={index} className="mb-5">
                    <article className="artist-block">
                      {datesGroupedByArtiste[artisteID][0].artiste.img_url && (
                        <img
                          alt={
                            datesGroupedByArtiste[artisteID][0].artiste
                              .artiste_name
                          }
                          className="profil-pic"
                          src={
                            datesGroupedByArtiste[artisteID][0].artiste.img_url
                          }
                        />
                      )}
                      <div className="artist-block-name">
                        <h2>
                          {
                            datesGroupedByArtiste[artisteID][0].artiste
                              .artiste_name
                          }
                        </h2>
                        <button
                          type="button"
                          className="btn-classique"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal${datesGroupedByArtiste[artisteID][0].artiste.artiste_ID}`}
                          onMouseEnter={() =>
                            handleMouseEnterArtiste(
                              datesGroupedByArtiste[artisteID][0].artiste
                                .artiste_ID
                            )
                          }
                          onClick={() =>
                            handleArtisteID(
                              datesGroupedByArtiste[artisteID][0].artiste
                                .artiste_ID
                            )
                          }
                        >
                          Ajouter Facture
                        </button>
                      </div>
                    </article>
                    {displayModal ===
                    datesGroupedByArtiste[artisteID][0].artiste.artiste_ID ? (
                      <div
                        className="modal fade"
                        id={`modal${datesGroupedByArtiste[artisteID][0].artiste.artiste_ID}`}
                        tabIndex="-1"
                        aria-labelledby={`#modalLabel${datesGroupedByArtiste[artisteID][0].artiste.artiste_ID}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={`#modalLabel${datesGroupedByArtiste[artisteID][0].artiste.artiste_ID}`}
                              >
                                {
                                  datesGroupedByArtiste[artisteID][0].artiste
                                    .artiste_name
                                }
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <CreatableSelect
                                isClearable
                                value={selectedClient}
                                onChange={handleSelectCLientChange}
                                options={clientsOptions}
                                placeholder="Sélectionner un client"
                              />
                              <div className="mb-3">
                                <label
                                  htmlFor="facture_number"
                                  className="form-label"
                                >
                                  N°Facture
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="facture_number"
                                  value={newFacture.facture_number}
                                  onChange={(event) =>
                                    handleChange("facture_number", event)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="facture_link"
                                  className="form-label"
                                >
                                  Lien Facture
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="facture_link"
                                  value={newFacture.facture_link}
                                  onChange={(event) =>
                                    handleChange("facture_link", event)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="acompte_status"
                                  className="form-label"
                                >
                                  Acompte
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="acompte_status"
                                  value={newFacture.acompte_status}
                                  onChange={(event) =>
                                    handleChange("acompte_status", event)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="date_relance"
                                  className="form-label"
                                >
                                  Date Relance
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="date_relance"
                                  value={newFacture.date_relance}
                                  onChange={(event) =>
                                    handleChange("date_relance", event)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="commentary"
                                  className="form-label"
                                >
                                  Commentaire
                                </label>
                                <textarea
                                  type="text"
                                  className="form-control"
                                  id="commentary"
                                  value={newFacture.commentary}
                                  onChange={(event) =>
                                    handleChange("commentary", event)
                                  }
                                />
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Fermer
                              </button>
                              <button
                                type="button"
                                data-bs-dismiss="modal"
                                className="btn btn-primary"
                                onClick={() =>
                                  handleNewFactureArtiste(
                                    datesGroupedByArtiste[artisteID][0].artiste
                                      .artiste_ID
                                  )
                                }
                                disabled={
                                  selectedClient === null ||
                                  newFacture.facture_number === null ||
                                  newFacture.facture_number === ""
                                }
                              >
                                Ajouter Facture
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {facturesGroupedByDate[`null-${artisteID}`] &&
                    (artisteHasNoDateActiveFactures(
                      facturesGroupedByDate[`null-${artisteID}`][0]["artiste"][
                        "artiste_ID"
                      ]
                    ) ||
                      (showArchivedInvoices &&
                        artisteHasNonArchivedFacture(
                          facturesGroupedByDate[`null-${artisteID}`][0][
                            "artiste"
                          ]["artiste_ID"]
                        ))) ? (
                      <div className="mb-3 space">
                        <h4>Factures sans date associée</h4>

                        <table className="table table-sm table-bordered table-hover">
                          <thead className="thead-dark">
                            <tr>
                              <th className="col-client">Client</th>
                              <th className="col-facture">N°Facture</th>
                              <th className="col-link">Lien Facture</th>
                              <th className="col-acompte">Acompte</th>
                              <th className="col-relance">Date Relance</th>
                              <th className="col-com">Commentaire</th>
                              <th className="col-archive">Archivé ?</th>
                              <th className="col-delete"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {facturesGroupedByDate[`null-${artisteID}`]
                              .filter(
                                (facture) =>
                                  showArchivedInvoices ||
                                  facture.archive_status === "false"
                              )
                              .map((facture, index) => (
                                <tr key={index}>
                                  {editId ===
                                  `client_name_${facture.facture_ID}` ? (
                                    <td>
                                      <CreatableSelect
                                        className="special-width"
                                        id={`client_name_${facture.facture_ID}`}
                                        isClearable
                                        value={selectedClient}
                                        onChange={handleSelectCLientChange}
                                        options={clientsOptions}
                                        placeholder="Sélectionner un client"
                                      />
                                      <button
                                        className="btn-classique"
                                        onClick={() =>
                                          handleEditFacture(
                                            "client_name",
                                            selectedClient.label,
                                            facture.facture_ID
                                          )
                                        }
                                      >
                                        Confirmer
                                      </button>
                                    </td>
                                  ) : (
                                    <td
                                      className="col-client"
                                      onClick={() => {
                                        handleSelectEditFacture(
                                          "client_name",
                                          facture.facture_ID
                                        );
                                        setTimeout(() => {
                                          const input = document.getElementById(
                                            `client_name_${facture.facture_ID}`
                                          );
                                          if (input) input.focus();
                                        }, 0);
                                      }}
                                    >
                                      {facture.client.client_name}
                                    </td>
                                  )}

                                  {editId ===
                                  `facture_number_${facture.facture_ID}` ? (
                                    <td className="col-facture">
                                      <input
                                        id={`facture_number_${facture.facture_ID}`}
                                        value={newFacture.facture_number}
                                        onChange={(event) =>
                                          handleChange("facture_number", event)
                                        }
                                        onBlur={() =>
                                          handleEditFacture(
                                            "facture_number",
                                            newFacture.facture_number,
                                            facture.facture_ID
                                          )
                                        }
                                        onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleEditFacture(
                                              "facture_number",
                                              newFacture.facture_number,
                                              facture.facture_ID
                                            );
                                          }
                                        }}
                                      ></input>
                                    </td>
                                  ) : (
                                    <td
                                      className="col-facture"
                                      onClick={() => {
                                        handleSelectEditFacture(
                                          "facture_number",
                                          facture.facture_ID
                                        );
                                        setTimeout(() => {
                                          const input = document.getElementById(
                                            `facture_number_${facture.facture_ID}`
                                          );
                                          if (input) input.focus();
                                        }, 0);
                                      }}
                                    >
                                      {facture.facture_number}
                                    </td>
                                  )}

                                  {editId ===
                                  `facture_link_${facture.facture_ID}` ? (
                                    <td className="col-link">
                                      <input
                                        id={`facture_link_${facture.facture_ID}`}
                                        value={newFacture.facture_link}
                                        onChange={(event) =>
                                          handleChange("facture_link", event)
                                        }
                                        onBlur={() =>
                                          handleEditFacture(
                                            "facture_link",
                                            newFacture.facture_link,
                                            facture.facture_ID
                                          )
                                        }
                                        onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleEditFacture(
                                              "facture_link",
                                              newFacture.facture_link,
                                              facture.facture_ID
                                            );
                                          }
                                        }}
                                      ></input>
                                    </td>
                                  ) : (
                                    <td className="col-link facture_link">
                                      <a
                                        href={facture.facture_link}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Voir
                                      </a>
                                      <i
                                        onClick={() => {
                                          handleSelectEditFacture(
                                            "facture_link",
                                            facture.facture_ID
                                          );
                                          setTimeout(() => {
                                            const input =
                                              document.getElementById(
                                                `facture_link_${facture.facture_ID}`
                                              );
                                            if (input) input.focus();
                                          }, 0);
                                        }}
                                        className="fa-solid fa-pencil cursor"
                                      ></i>
                                    </td>
                                  )}

                                  {editId ===
                                  `acompte_status_${facture.facture_ID}` ? (
                                    <td className="col-acompte">
                                      <input
                                        id={`acompte_status_${facture.facture_ID}`}
                                        value={newFacture.acompte_status}
                                        onChange={(event) =>
                                          handleChange("acompte_status", event)
                                        }
                                        onBlur={() =>
                                          handleEditFacture(
                                            "acompte_status",
                                            newFacture.acompte_status,
                                            facture.facture_ID
                                          )
                                        }
                                        onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleEditFacture(
                                              "acompte_status",
                                              newFacture.acompte_status,
                                              facture.facture_ID
                                            );
                                          }
                                        }}
                                      ></input>
                                    </td>
                                  ) : (
                                    <td
                                      className={`col-acompte ${
                                        facture.acompte_status.includes("OK")
                                          ? "table-success"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        handleSelectEditFacture(
                                          "acompte_status",
                                          facture.facture_ID
                                        );
                                        setTimeout(() => {
                                          const input = document.getElementById(
                                            `acompte_status_${facture.facture_ID}`
                                          );
                                          if (input) input.focus();
                                        }, 0);
                                      }}
                                    >
                                      {facture.acompte_status}
                                    </td>
                                  )}
                                  {editId ===
                                  `date_relance_${facture.facture_ID}` ? (
                                    <td className="col-relance">
                                      <input
                                        id={`date_relance_${facture.facture_ID}`}
                                        value={newFacture.date_relance}
                                        onChange={(event) =>
                                          handleChange("date_relance", event)
                                        }
                                        onBlur={() =>
                                          handleEditFacture(
                                            "date_relance",
                                            newFacture.date_relance,
                                            facture.facture_ID
                                          )
                                        }
                                        onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleEditFacture(
                                              "date_relance",
                                              newFacture.date_relance,
                                              facture.facture_ID
                                            );
                                          }
                                        }}
                                      ></input>
                                    </td>
                                  ) : (
                                    <td
                                      className="col-relance"
                                      onClick={() => {
                                        handleSelectEditFacture(
                                          "date_relance",
                                          facture.facture_ID
                                        );
                                        setTimeout(() => {
                                          const input = document.getElementById(
                                            `date_relance_${facture.facture_ID}`
                                          );
                                          if (input) input.focus();
                                        }, 0);
                                      }}
                                    >
                                      {facture.date_relance}
                                    </td>
                                  )}
                                  {editId ===
                                  `commentary_${facture.facture_ID}` ? (
                                    <td className="col-com">
                                      <input
                                        id={`commentary_${facture.facture_ID}`}
                                        value={newFacture.commentary}
                                        onChange={(event) =>
                                          handleChange("commentary", event)
                                        }
                                        onBlur={() =>
                                          handleEditFacture(
                                            "commentary",
                                            newFacture.commentary,
                                            facture.facture_ID
                                          )
                                        }
                                        onKeyPress={(event) => {
                                          if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleEditFacture(
                                              "commentary",
                                              newFacture.commentary,
                                              facture.facture_ID
                                            );
                                          }
                                        }}
                                      ></input>
                                    </td>
                                  ) : (
                                    <td
                                      className="col-com"
                                      onClick={() => {
                                        handleSelectEditFacture(
                                          "commentary",
                                          facture.facture_ID
                                        );
                                        setTimeout(() => {
                                          const input = document.getElementById(
                                            `commentary_${facture.facture_ID}`
                                          );
                                          if (input) input.focus();
                                        }, 0);
                                      }}
                                    >
                                      {facture.commentary}
                                    </td>
                                  )}
                                  <td className="center col-archive">
                                    {facture.archive_status === "true" ? (
                                      <i
                                        onClick={() =>
                                          handleOutArchive(facture.facture_ID)
                                        }
                                        className="fa-solid fa-box-archive cursor"
                                      ></i>
                                    ) : (
                                      <i
                                        onClick={() =>
                                          handleArchive(facture.facture_ID)
                                        }
                                        className="fa-regular fa-folder-open cursor"
                                      ></i>
                                    )}
                                  </td>
                                  <td className="trash-can col-delete">
                                    <i
                                      onClick={() =>
                                        handleDeleteFacture(facture.facture_ID)
                                      }
                                      className="fa-solid fa-trash cursor trash"
                                    ></i>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    <div>
                      <table className="table table-striped table-bordered space">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Factures</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datesGroupedByArtiste[artisteID]
                            .filter(
                              (date) =>
                                showEmptyDates || dateHasFactures(date.date_ID)
                            )
                            .filter(
                              (date) =>
                                showEmptyDates ||
                                (showArchivedInvoices
                                  ? dateHasFactures(date.date_ID)
                                  : dateHasNonArchivedFactures(date.date_ID))
                            )
                            .map((date) => (
                              <tr key={date.date_ID}>
                                <td>
                                  {formatFrenchDate(date.date)}
                                  <br></br>
                                  <button
                                    type="button"
                                    className="btn-classique"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#modal${date.date_ID}`}
                                    onMouseEnter={() =>
                                      handleMouseEnterDate(date.date_ID)
                                    }
                                    onClick={() =>
                                      handleArtisteID(date.artiste.artiste_ID)
                                    }
                                  >
                                    Ajouter Facture
                                  </button>
                                  {displayModalDate === date.date_ID ? (
                                    <div
                                      className="modal fade"
                                      id={`modal${date.date_ID}`}
                                      tabIndex="-1"
                                      aria-labelledby={`#modalLabel${date.date_ID}`}
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1
                                              className="modal-title fs-5"
                                              id={`#modalLabel${date.date_ID}`}
                                            >
                                              {formatFrenchDate(date.date)} -{" "}
                                              {date.artiste.artiste_name}
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            ></button>
                                          </div>
                                          <div className="modal-body">
                                            <CreatableSelect
                                              isClearable
                                              value={selectedClient}
                                              onChange={
                                                handleSelectCLientChange
                                              }
                                              options={clientsOptions}
                                              placeholder="Sélectionner un client"
                                            />
                                            <div className="mb-3">
                                              <label
                                                htmlFor="facture_number"
                                                className="form-label"
                                              >
                                                N°Facture
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="facture_number"
                                                value={
                                                  newFacture.facture_number
                                                }
                                                onChange={(event) =>
                                                  handleChange(
                                                    "facture_number",
                                                    event
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="facture_link"
                                                className="form-label"
                                              >
                                                Lien Facture
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="facture_link"
                                                value={newFacture.facture_link}
                                                onChange={(event) =>
                                                  handleChange(
                                                    "facture_link",
                                                    event
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="acompte_status"
                                                className="form-label"
                                              >
                                                Acompte
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="acompte_status"
                                                value={
                                                  newFacture.acompte_status
                                                }
                                                onChange={(event) =>
                                                  handleChange(
                                                    "acompte_status",
                                                    event
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="date_relance"
                                                className="form-label"
                                              >
                                                Date Relance
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="date_relance"
                                                value={newFacture.date_relance}
                                                onChange={(event) =>
                                                  handleChange(
                                                    "date_relance",
                                                    event
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="commentary"
                                                className="form-label"
                                              >
                                                Commentaire
                                              </label>
                                              <textarea
                                                type="text"
                                                className="form-control"
                                                id="commentary"
                                                value={newFacture.commentary}
                                                onChange={(event) =>
                                                  handleChange(
                                                    "commentary",
                                                    event
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              data-bs-dismiss="modal"
                                            >
                                              Fermer
                                            </button>
                                            <button
                                              type="button"
                                              data-bs-dismiss="modal"
                                              className="btn btn-primary"
                                              onClick={() =>
                                                handleNewFacture(date.date_ID)
                                              }
                                              disabled={
                                                selectedClient === null ||
                                                newFacture.facture_number ===
                                                  null ||
                                                newFacture.facture_number === ""
                                              }
                                            >
                                              Ajouter Facture
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </td>
                                <td>
                                  {facturesGroupedByDate[date.date_ID] ? (
                                    <table className="table table-sm table-bordered mb-0 table-hover">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th className="col-client">Client</th>
                                          <th className="col-facture">
                                            N°Facture
                                          </th>
                                          <th className="col-link">
                                            Lien Facture
                                          </th>
                                          <th className="col-acompte">
                                            Acompte
                                          </th>
                                          <th className="col-relance">
                                            Date Relance
                                          </th>
                                          <th className="col-com">
                                            Commentaire
                                          </th>
                                          <th className="col-archive">
                                            Archivé ?
                                          </th>
                                          <th className="col-delete">Delete</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {facturesGroupedByDate[date.date_ID]
                                          .filter(
                                            (facture) =>
                                              showArchivedInvoices ||
                                              facture.archive_status === "false"
                                          )
                                          .map((facture) => (
                                            <tr key={facture.facture_number}>
                                              {editId ===
                                              `client_name_${facture.facture_ID}` ? (
                                                <td className="col-client">
                                                  <CreatableSelect
                                                    className="special-width"
                                                    id={`client_name_${facture.facture_ID}`}
                                                    isClearable
                                                    value={selectedClient}
                                                    onChange={
                                                      handleSelectCLientChange
                                                    }
                                                    options={clientsOptions}
                                                    placeholder="Sélectionner un client"
                                                  />
                                                  <button
                                                    className="btn-classique"
                                                    onClick={() =>
                                                      handleEditFacture(
                                                        "client_name",
                                                        selectedClient.label,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                  >
                                                    Confirmer
                                                  </button>
                                                </td>
                                              ) : (
                                                <td
                                                  className="col-client"
                                                  onClick={() => {
                                                    handleSelectEditFacture(
                                                      "client_name",
                                                      facture.facture_ID
                                                    );
                                                    setTimeout(() => {
                                                      const input =
                                                        document.getElementById(
                                                          `client_name_${facture.facture_ID}`
                                                        );
                                                      if (input) input.focus();
                                                    }, 0);
                                                  }}
                                                >
                                                  {facture.client.client_name}
                                                </td>
                                              )}
                                              {editId ===
                                              `facture_number_${facture.facture_ID}` ? (
                                                <td className="col-facture">
                                                  <input
                                                    id={`facture_number_${facture.facture_ID}`}
                                                    value={
                                                      newFacture.facture_number
                                                    }
                                                    onChange={(event) =>
                                                      handleChange(
                                                        "facture_number",
                                                        event
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      handleEditFacture(
                                                        "facture_number",
                                                        newFacture.facture_number,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    onKeyPress={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        handleEditFacture(
                                                          "facture_number",
                                                          newFacture.facture_number,
                                                          facture.facture_ID
                                                        );
                                                      }
                                                    }}
                                                  ></input>
                                                </td>
                                              ) : (
                                                <td
                                                  className="col-facture"
                                                  onClick={() => {
                                                    handleSelectEditFacture(
                                                      "facture_number",
                                                      facture.facture_ID
                                                    );
                                                    setTimeout(() => {
                                                      const input =
                                                        document.getElementById(
                                                          `facture_number_${facture.facture_ID}`
                                                        );
                                                      if (input) input.focus();
                                                    }, 0);
                                                  }}
                                                >
                                                  {facture.facture_number}
                                                </td>
                                              )}

                                              {editId ===
                                              `facture_link_${facture.facture_ID}` ? (
                                                <td className="col-link">
                                                  <input
                                                    id={`facture_link_${facture.facture_ID}`}
                                                    value={
                                                      newFacture.facture_link
                                                    }
                                                    onChange={(event) =>
                                                      handleChange(
                                                        "facture_link",
                                                        event
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      handleEditFacture(
                                                        "facture_link",
                                                        newFacture.facture_link,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    onKeyPress={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        handleEditFacture(
                                                          "facture_link",
                                                          newFacture.facture_link,
                                                          facture.facture_ID
                                                        );
                                                      }
                                                    }}
                                                  ></input>
                                                </td>
                                              ) : (
                                                <td className="facture_link col-link">
                                                  <a
                                                    href={facture.facture_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                  >
                                                    Voir
                                                  </a>
                                                  <i
                                                    onClick={() => {
                                                      handleSelectEditFacture(
                                                        "facture_link",
                                                        facture.facture_ID
                                                      );
                                                      setTimeout(() => {
                                                        const input =
                                                          document.getElementById(
                                                            `facture_link_${facture.facture_ID}`
                                                          );
                                                        if (input)
                                                          input.focus();
                                                      }, 0);
                                                    }}
                                                    className="fa-solid fa-pencil cursor"
                                                  ></i>
                                                </td>
                                              )}

                                              {editId ===
                                              `acompte_status_${facture.facture_ID}` ? (
                                                <td className="col-acompte">
                                                  <input
                                                    id={`acompte_status_${facture.facture_ID}`}
                                                    value={
                                                      newFacture.acompte_status
                                                    }
                                                    onChange={(event) =>
                                                      handleChange(
                                                        "acompte_status",
                                                        event
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      handleEditFacture(
                                                        "acompte_status",
                                                        newFacture.acompte_status,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    onKeyPress={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        handleEditFacture(
                                                          "acompte_status",
                                                          newFacture.acompte_status,
                                                          facture.facture_ID
                                                        );
                                                      }
                                                    }}
                                                  ></input>
                                                </td>
                                              ) : (
                                                <td
                                                  className={`col-acompte ${
                                                    facture.acompte_status.includes(
                                                      "OK"
                                                    )
                                                      ? "table-success"
                                                      : ""
                                                  }`}
                                                  onClick={() => {
                                                    handleSelectEditFacture(
                                                      "acompte_status",
                                                      facture.facture_ID
                                                    );
                                                    setTimeout(() => {
                                                      const input =
                                                        document.getElementById(
                                                          `acompte_status_${facture.facture_ID}`
                                                        );
                                                      if (input) input.focus();
                                                    }, 0);
                                                  }}
                                                >
                                                  {facture.acompte_status}
                                                </td>
                                              )}
                                              {editId ===
                                              `date_relance_${facture.facture_ID}` ? (
                                                <td className="col-relance">
                                                  <input
                                                    id={`date_relance_${facture.facture_ID}`}
                                                    value={
                                                      newFacture.date_relance
                                                    }
                                                    onChange={(event) =>
                                                      handleChange(
                                                        "date_relance",
                                                        event
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      handleEditFacture(
                                                        "date_relance",
                                                        newFacture.date_relance,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    onKeyPress={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        handleEditFacture(
                                                          "date_relance",
                                                          newFacture.date_relance,
                                                          facture.facture_ID
                                                        );
                                                      }
                                                    }}
                                                  ></input>
                                                </td>
                                              ) : (
                                                <td
                                                  className="col-relance"
                                                  onClick={() => {
                                                    handleSelectEditFacture(
                                                      "date_relance",
                                                      facture.facture_ID
                                                    );
                                                    setTimeout(() => {
                                                      const input =
                                                        document.getElementById(
                                                          `date_relance_${facture.facture_ID}`
                                                        );
                                                      if (input) input.focus();
                                                    }, 0);
                                                  }}
                                                >
                                                  {facture.date_relance}
                                                </td>
                                              )}
                                              {editId ===
                                              `commentary_${facture.facture_ID}` ? (
                                                <td className="col-com">
                                                  <input
                                                    id={`commentary_${facture.facture_ID}`}
                                                    value={
                                                      newFacture.commentary
                                                    }
                                                    onChange={(event) =>
                                                      handleChange(
                                                        "commentary",
                                                        event
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      handleEditFacture(
                                                        "commentary",
                                                        newFacture.commentary,
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    onKeyPress={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        handleEditFacture(
                                                          "commentary",
                                                          newFacture.commentary,
                                                          facture.facture_ID
                                                        );
                                                      }
                                                    }}
                                                  ></input>
                                                </td>
                                              ) : (
                                                <td
                                                  className="col-com"
                                                  onClick={() => {
                                                    handleSelectEditFacture(
                                                      "commentary",
                                                      facture.facture_ID
                                                    );
                                                    setTimeout(() => {
                                                      const input =
                                                        document.getElementById(
                                                          `commentary_${facture.facture_ID}`
                                                        );
                                                      if (input) input.focus();
                                                    }, 0);
                                                  }}
                                                >
                                                  {facture.commentary}
                                                </td>
                                              )}
                                              <td className="center col-archive">
                                                {facture.archive_status ===
                                                "true" ? (
                                                  <i
                                                    onClick={() =>
                                                      handleOutArchive(
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    className="fa-solid fa-box-archive cursor"
                                                  ></i>
                                                ) : (
                                                  <i
                                                    onClick={() =>
                                                      handleArchive(
                                                        facture.facture_ID
                                                      )
                                                    }
                                                    className="fa-regular fa-folder-open cursor"
                                                  ></i>
                                                )}
                                              </td>
                                              <td className="trash-can col-delete">
                                                <i
                                                  onClick={() =>
                                                    handleDeleteFacture(
                                                      facture.facture_ID
                                                    )
                                                  }
                                                  className="fa-solid fa-trash cursor trash"
                                                ></i>
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <span>Aucune facture</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null;
              })}
          </div>
        </>
      )}
    </>
  );
};

export default Compta;
