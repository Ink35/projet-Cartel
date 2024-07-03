import { useDispatch, useSelector } from "react-redux";
import { getAllDates } from "../actions/date.action";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import { selectDates } from "../reducers/date.reducer";
import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { updateChecklist } from "../actions/checklist.action";
import { selectArtistes } from "../reducers/artiste.reducer";
import { getAllArtistes } from "../actions/artiste.action";

const Checklist = () => {
  const dispatch = useDispatch();
  const dates = useSelector(selectDates);
  const loggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const artistes = useSelector(selectArtistes);
  const animatedComponents = makeAnimated();
  const [sortedDates, setSortedDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState(dates);
  const [editId, setEditId] = useState();
  const [newChecklist, setNewChecklist] = useState({
    inter: "",
    in_sale: "",
    contrat_signed: "",
    contrat_send: "",
    facture_send: "",
    mail_adv: "",
    vhr: "",
    touring: "",
    form: "",
    pre_settle: "",
    movin: "",
    justif_prod: "",
    facture_contrat: "",
    archive_status: "",
  });

  const currentYear = new Date().getFullYear();

  const defaultYearOption = {
    value: currentYear,
    label: currentYear.toString(),
  };
  const [filterDatesOptions, setFilterDatesOptions] = useState({
    year: [defaultYearOption],
    month: "",
    status: [{ value: "confirmed", label: "Confirmé" }],
    cities: "",
    places: "",
    artistes: "",
    types: "",
    subtypes: "",
    structures: [{ value: 1, label: "Cartel Concerts" }],
    users: "",
    agents: "",
    archive_status: false,
  });

  function dateFiltering(donnees, filtre) {
    return donnees.filter(function (donnee) {
      if (filtre.year.length > 0) {
        const dateYear = new Date(donnee.date).getFullYear();
        if (!filtre.year.some((year) => year.value === dateYear)) {
          return false;
        }
      }
      if (filtre.month.length > 0) {
        const dateMonth = new Date(donnee.date).getMonth() + 1;
        if (!filtre.month.some((month) => month.value === dateMonth)) {
          return false;
        }
      }
      if (
        filtre.status.length > 0 &&
        !filtre.status.some((statu) => statu.value === donnee.status)
      ) {
        return false;
      }
      if (
        filtre.cities.length > 0 &&
        !filtre.cities.some((city) => city.value === donnee.city.city_ID)
      ) {
        return false;
      }
      if (
        filtre.artistes.length > 0 &&
        !filtre.artistes.some(
          (artist) => artist.value === donnee.artiste.artiste_ID
        )
      ) {
        return false;
      }
      if (
        filtre.places.length > 0 &&
        !filtre.places.some((place) => place.value === donnee.place.place_ID)
      ) {
        return false;
      }
      if (
        filtre.types.length > 0 &&
        !filtre.types.some((type) => type.value === donnee.type.type_ID)
      ) {
        return false;
      }
      if (
        filtre.subtypes.length > 0 &&
        !filtre.subtypes.some(
          (subtype) => subtype.value === donnee.subtype.subtype_ID
        )
      ) {
        return false;
      }
      if (
        filtre.structures.length > 0 &&
        !filtre.structures.some(
          (structure) => structure.value === donnee.structure.structure_ID
        )
      ) {
        return false;
      }
      if (
        filtre.users.length > 0 &&
        !filtre.users.some((user) => user.value === donnee.user.user_ID)
      ) {
        return false;
      }
      if (
        filtre.agents.length > 0 &&
        !filtre.agents.some((agent) => agent.value === donnee.agent.agent_ID)
      ) {
        return false;
      }
      if (
        !filtre.archive_status &&
        donnee.checklist.archive_status === "true"
      ) {
        return false;
      }

      return true;
    });
  }

  const allYears =
    dates && dates.map((date) => new Date(date.date).getFullYear());

  const uniqueYears = Array.from(new Set(allYears));

  const yearOptions =
    uniqueYears &&
    uniqueYears.map((year) => ({
      value: year,
      label: year.toString(),
    }));

  const monthOptions = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Aout" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const artistesOptions =
    artistes &&
    artistes.map((artiste) => ({
      value: artiste.artiste_ID,
      label: artiste.artiste_name,
    }));

  const archiveStatusOptions = [
    { value: "true", label: "Archivé" },
    { value: "false", label: "Non archivé" },
  ];

  useEffect(() => {
    if (dates) {
      setFilteredDates(dateFiltering(dates, filterDatesOptions));
    }
  }, [filterDatesOptions, dates]);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllArtistes());
  }, []);

  const capitalizeFirstLetter = (str) => {
    if (typeof str !== "string" || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [sortedData, setSortedData] = useState([]);

  const datesGroupedByArtiste = useMemo(() => {
    return sortedDates.reduce((acc, date) => {
      const { artiste_ID } = date.artiste;
      if (!acc[artiste_ID]) {
        acc[artiste_ID] = [];
      }
      acc[artiste_ID].push(date);
      return acc;
    }, {});
  }, [sortedDates]);

  useEffect(() => {
    const sortedDataArray = Object.keys(datesGroupedByArtiste)
      .sort((a, b) => {
        const dateA = new Date(datesGroupedByArtiste[a][0].date);
        const dateB = new Date(datesGroupedByArtiste[b][0].date);
        return dateA - dateB;
      })
      .map((key) => ({ artisteId: key, dates: datesGroupedByArtiste[key] }));

    setSortedData(sortedDataArray);
  }, [datesGroupedByArtiste]);

  // Tri des dates par ordre croissant
  useEffect(() => {
    if (filteredDates && filteredDates.length > 0) {
      const sortedData = [...filteredDates].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSortedDates(sortedData);
    }
  }, [filteredDates]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const shortYear = year.slice(-2);
    const formattedDate = `${day}/${month}/${shortYear}`;
    return formattedDate;
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setFilterDatesOptions((prevFilters) => ({
      ...prevFilters,
      archive_status: checked,
    }));
  };

  const handleSelectChange = (property, selectedOption) => {
    setFilterDatesOptions((prevFilters) => ({
      ...prevFilters,
      [property]: selectedOption,
    }));
  };

  const handleOutArchive = (date_ID) => {
    handleEditChecklist("archive_status", "false", date_ID);
  };

  const handleArchive = (date_ID) => {
    handleEditChecklist("archive_status", "true", date_ID);
  };

  const handleEditChecklist = (type, value, date_ID) => {
    const dateToEdit = dates.find((date) => date.date_ID === date_ID);
    const formDate = new FormData();

    if (dateToEdit) {
      const checklist = dateToEdit.checklist;

      if (checklist.checklist_ID !== null)
        formDate.append("checklist_ID", checklist.checklist_ID);
      if (checklist.inter !== null) formDate.append("inter", checklist.inter);
      if (checklist.in_sale !== null)
        formDate.append("in_sale", checklist.in_sale);
      if (checklist.contrat_signed !== null)
        formDate.append("contrat_signed", checklist.contrat_signed);
      if (checklist.contrat_send !== null)
        formDate.append("contrat_send", checklist.contrat_send);
      if (checklist.facture_send !== null)
        formDate.append("facture_send", checklist.facture_send);
      if (checklist.mail_adv !== null)
        formDate.append("mail_adv", checklist.mail_adv);
      if (checklist.vhr !== null) formDate.append("vhr", checklist.vhr);
      if (checklist.touring !== null)
        formDate.append("touring", checklist.touring);
      if (checklist.form !== null) formDate.append("form", checklist.form);
      if (checklist.pre_settle !== null)
        formDate.append("pre_settle", checklist.pre_settle);
      if (checklist.movin !== null) formDate.append("movin", checklist.movin);
      if (checklist.justif_prod !== null)
        formDate.append("justif_prod", checklist.justif_prod);
      if (checklist.facture_contrat !== null)
        formDate.append("facture_contrat", checklist.facture_contrat);
      if (checklist.archive_status !== null)
        formDate.append("archive_status", checklist.archive_status);
    }
    let hasChanges = false;
    if (type === "inter" && value === "BK FR") {
      if (formDate.get("justif_prod") !== "/") {
        formDate.set("justif_prod", "/");
        hasChanges = true;
      }
      if (formDate.get("facture_contrat") !== "/") {
        formDate.set("facture_contrat", "/");
        hasChanges = true;
      }
      if (formDate.get("pre_settle") !== "/") {
        formDate.set("pre_settle", "/");
        hasChanges = true;
      }
      formDate.set(type, value);
    } else {
      if (formDate.get(type) !== value) {
        formDate.set(type, value);
        hasChanges = true;
      }
    }

    // Si aucune modification, quittez la fonction sans envoyer la requête
    if (!hasChanges) {
      setEditId(null);
      return;
    }

    // Envoyez la requête de mise à jour
    dispatch(updateChecklist(formDate)).then((res) => {});

    setEditId(null);
  };

  const handleSelectEditChecklist = (type, date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    setNewChecklist((prevChecklist) => ({
      ...prevChecklist,
      [type]: dateEdit["checklist"][type],
    }));
    setEditId(`${type}_${date_ID}`);
  };

  const handleChange = (type, event) => {
    setNewChecklist((prevChecklist) => ({
      ...prevChecklist,
      [type]: event.target.value,
    }));
  };

  const getStatusClass = (type) => {
    if (type && type.includes("OK")) return "table-success";
    if (type && type.includes("ATTENTE")) return "table-warning";
    if (type && type.includes("FAIRE")) return "table-danger";
    if (type && type.includes("FR")) return "table-info";
    if (type && type.includes("INTER")) return "table-danger";
    if (type && type.includes("PROD")) return "table-warning";
    if (type && type.includes("/")) return "table-success";
    if (type && type.includes("?")) return "table-danger";
    return "";
  };

  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }

  if (
    currentUser &&
    currentUser.role !== "prod" &&
    currentUser.role !== "dev"
  ) {
    return <Navigate to="/suivi" />;
  }

  return (
    <>
      <section className="filterBar">
        <Select
          isMulti
          components={animatedComponents}
          closeMenuOnSelect={true}
          name="Artistes"
          value={filterDatesOptions.artistes}
          onChange={(selectedOption) =>
            handleSelectChange("artistes", selectedOption)
          }
          options={artistesOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Artiste(s)"
        />
        <Select
          isMulti
          name="Month"
          components={animatedComponents}
          value={filterDatesOptions.month}
          onChange={(selectedOption) =>
            handleSelectChange("month", selectedOption)
          }
          options={monthOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Mois"
        />
        <Select
          isMulti
          name="Year"
          components={animatedComponents}
          defaultValue={yearOptions[0]}
          value={filterDatesOptions.year}
          onChange={(selectedOption) =>
            handleSelectChange("year", selectedOption)
          }
          options={yearOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Année(s)"
        />
        <label>
          <input
            type="checkbox"
            checked={filterDatesOptions.archive_status}
            onChange={handleCheckboxChange}
          />
          Afficher les archivés
        </label>
      </section>
      {sortedData.map((artiste) => {
        return (
          <section key={artiste.dates[0].artiste.artiste_ID}>
            <article className="artist-block">
              {artiste.dates[0].artiste.img_url && (
                <img
                  alt={artiste.dates[0].artiste.artiste_name}
                  className="profil-pic small"
                  src={artiste.dates[0].artiste.img_url}
                />
              )}
              <div className="artist-block-name-small">
                <h2>{artiste.dates[0].artiste.artiste_name}</h2>
              </div>
            </article>
            {artiste.dates.length > 0 && (
              <table className="table table-striped table-hover table-bordered center">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th className="col-checklist">Inter</th>
                    <th>Date</th>
                    <th>Ville</th>
                    <th>Salle</th>
                    <th className="col-checklist">Contrat Envoyé</th>
                    <th className="col-checklist">Contrat Signé</th>
                    <th className="col-checklist">Facture Envoyé</th>
                    <th className="col-checklist">Mail ADV</th>
                    <th className="col-checklist">VHR</th>
                    <th className="col-checklist">Touring</th>
                    <th className="col-checklist">Form</th>
                    <th className="col-checklist">Pre Settle</th>
                    <th className="col-checklist">Movin</th>
                    <th className="col-checklist">Justif Prod</th>
                    <th className="col-checklist">Facture-Contrat</th>
                    <th className="col-checklist">Archivé ?</th>
                  </tr>
                </thead>
                <tbody>
                  {artiste.dates.map((date) => {
                    const cellIds = artiste.dates.map((date) => date.date_ID);
                    const currentIndex = cellIds.indexOf(date.date_ID);
                    return (
                      <tr key={date.date_ID}>
                        <td className="col-type">
                          {capitalizeFirstLetter(date.type.type)}
                        </td>
                        {editId === `inter_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`inter_${date.date_ID}`}
                              value={newChecklist.inter}
                              onChange={(event) => handleChange("inter", event)}
                              onBlur={() =>
                                handleEditChecklist(
                                  "inter",
                                  newChecklist.inter,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "inter",
                                    newChecklist.inter,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "inter",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `inter_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                }
                                if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "inter",
                                    newChecklist.inter,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "contrat_send",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `contrat_send_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                                if (event.key === "Tab" && event.shiftKey) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "inter",
                                    newChecklist.inter,
                                    date.date_ID
                                  );
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.inter
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist("inter", date.date_ID);
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `inter_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.inter}
                          </td>
                        )}
                        <td className="col-date">{formatDate(date.date)}</td>
                        <td className="col-city">{date.city.city_name}</td>
                        <td className="col-place">{date.place.place_name}</td>
                        {editId === `contrat_send_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`contrat_send_${date.date_ID}`}
                              value={newChecklist.contrat_send}
                              onChange={(event) =>
                                handleChange("contrat_send", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "contrat_send",
                                  newChecklist.contrat_send,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_send",
                                    newChecklist.contrat_send,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "contrat_send",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `contrat_send_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_send",
                                    newChecklist.contrat_send,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "inter",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `inter_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_send",
                                    newChecklist.contrat_send,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "contrat_signed",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `contrat_signed_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.contrat_send
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "contrat_send",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `contrat_send_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.contrat_send}
                          </td>
                        )}
                        {editId === `contrat_signed_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`contrat_signed_${date.date_ID}`}
                              value={newChecklist.contrat_signed}
                              onChange={(event) =>
                                handleChange("contrat_signed", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "contrat_signed",
                                  newChecklist.contrat_signed,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_signed",
                                    newChecklist.contrat_signed,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "contrat_signed",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `contrat_signed_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_signed",
                                    newChecklist.contrat_signed,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "contrat_send",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `contrat_send_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "contrat_signed",
                                    newChecklist.contrat_signed,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "facture_send",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `facture_send_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.contrat_signed
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "contrat_signed",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `contrat_signed_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.contrat_signed}
                          </td>
                        )}
                        {editId === `facture_send_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`facture_send_${date.date_ID}`}
                              value={newChecklist.facture_send}
                              onChange={(event) =>
                                handleChange("facture_send", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "facture_send",
                                  newChecklist.facture_send,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_send",
                                    newChecklist.facture_send,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "facture_send",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `facture_send_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_send",
                                    newChecklist.facture_send,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "contrat_signed",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `contrat_signed_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_send",
                                    newChecklist.facture_send,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "mail_adv",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `mail_adv_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.facture_send
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "facture_send",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `facture_send_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.facture_send}
                          </td>
                        )}
                        {editId === `mail_adv_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`mail_adv_${date.date_ID}`}
                              ref={(input) => {
                                if (
                                  input &&
                                  editId === `mail_adv_${date.date_ID}`
                                ) {
                                  input.focus();
                                }
                              }}
                              value={newChecklist.mail_adv}
                              onChange={(event) =>
                                handleChange("mail_adv", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "mail_adv",
                                  newChecklist.mail_adv,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "mail_adv",
                                    newChecklist.mail_adv,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "mail_adv",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `mail_adv_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "mail_adv",
                                    newChecklist.mail_adv,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "facture_send",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `facture_send_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "mail_adv",
                                    newChecklist.mail_adv,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "vhr",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `vhr_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            />
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.mail_adv
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "mail_adv",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `mail_adv_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.mail_adv}
                          </td>
                        )}

                        {editId === `vhr_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`vhr_${date.date_ID}`}
                              ref={(input) => {
                                if (input && editId === `vhr_${date.date_ID}`) {
                                  input.focus();
                                }
                              }}
                              value={newChecklist.vhr}
                              onChange={(event) => handleChange("vhr", event)}
                              onBlur={() =>
                                handleEditChecklist(
                                  "vhr",
                                  newChecklist.vhr,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "vhr",
                                    newChecklist.vhr,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "vhr",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `vhr_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "vhr",
                                    newChecklist.vhr,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "mail_adv",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `mail_adv_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "vhr",
                                    newChecklist.vhr,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "touring",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `touring_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            />
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.vhr
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist("vhr", date.date_ID);
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `vhr_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.vhr}
                          </td>
                        )}

                        {editId === `touring_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`touring_${date.date_ID}`}
                              value={newChecklist.touring}
                              onChange={(event) =>
                                handleChange("touring", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "touring",
                                  newChecklist.touring,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "touring",
                                    newChecklist.touring,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "touring",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `touring_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "touring",
                                    newChecklist.touring,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "vhr",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `vhr_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "touring",
                                    newChecklist.touring,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "form",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `form_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.touring
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "touring",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `touring_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.touring}
                          </td>
                        )}
                        {editId === `form_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`form_${date.date_ID}`}
                              value={newChecklist.form}
                              onChange={(event) => handleChange("form", event)}
                              onBlur={() =>
                                handleEditChecklist(
                                  "form",
                                  newChecklist.form,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "form",
                                    newChecklist.form,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "form",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `form_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "form",
                                    newChecklist.form,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "touring",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `touring_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "form",
                                    newChecklist.form,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "pre_settle",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `pre_settle_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.form
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist("form", date.date_ID);
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `form_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.form}
                          </td>
                        )}
                        {editId === `pre_settle_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`pre_settle_${date.date_ID}`}
                              value={newChecklist.pre_settle}
                              onChange={(event) =>
                                handleChange("pre_settle", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "pre_settle",
                                  newChecklist.pre_settle,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "pre_settle",
                                    newChecklist.pre_settle,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "pre_settle",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `pre_settle_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "pre_settle",
                                    newChecklist.pre_settle,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "form",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `form_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "pre_settle",
                                    newChecklist.pre_settle,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "movin",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `movin_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.pre_settle
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "pre_settle",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `pre_settle_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.pre_settle}
                          </td>
                        )}
                        {editId === `movin_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`movin_${date.date_ID}`}
                              value={newChecklist.movin}
                              onChange={(event) => handleChange("movin", event)}
                              onBlur={() =>
                                handleEditChecklist(
                                  "movin",
                                  newChecklist.movin,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "movin",
                                    newChecklist.movin,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "movin",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `movin_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "movin",
                                    newChecklist.movin,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "pre_settle",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `pre_settle_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "movin",
                                    newChecklist.movin,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "justif_prod",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `justif_prod_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.movin
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist("movin", date.date_ID);
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `movin_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.movin}
                          </td>
                        )}
                        {editId === `justif_prod_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`justif_prod_${date.date_ID}`}
                              value={newChecklist.justif_prod}
                              onChange={(event) =>
                                handleChange("justif_prod", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "justif_prod",
                                  newChecklist.justif_prod,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "justif_prod",
                                    newChecklist.justif_prod,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "justif_prod",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `justif_prod_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "justif_prod",
                                    newChecklist.justif_prod,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "movin",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `movin_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "justif_prod",
                                    newChecklist.justif_prod,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "facture_contrat",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `facture_contrat_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.justif_prod
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "justif_prod",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `justif_prod_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.justif_prod}
                          </td>
                        )}
                        {editId === `facture_contrat_${date.date_ID}` ? (
                          <td className="col-checklist">
                            <input
                              id={`facture_contrat_${date.date_ID}`}
                              value={newChecklist.facture_contrat}
                              onChange={(event) =>
                                handleChange("facture_contrat", event)
                              }
                              onBlur={() =>
                                handleEditChecklist(
                                  "facture_contrat",
                                  newChecklist.facture_contrat,
                                  date.date_ID
                                )
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_contrat",
                                    newChecklist.facture_contrat,
                                    date.date_ID
                                  );
                                  const nextIndex = currentIndex + 1;
                                  if (nextIndex < cellIds.length) {
                                    const nextCellId =
                                      currentIndex < cellIds.length - 1
                                        ? cellIds[currentIndex + 1]
                                        : null;
                                    handleSelectEditChecklist(
                                      "facture_contrat",
                                      nextCellId
                                    );
                                    setTimeout(() => {
                                      const input = document.getElementById(
                                        `facture_contrat_${nextCellId}`
                                      );
                                      if (input) input.focus();
                                    }, 0);
                                  }
                                } else if (
                                  event.key === "Tab" &&
                                  event.shiftKey
                                ) {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_contrat",
                                    newChecklist.facture_contrat,
                                    date.date_ID
                                  );
                                  handleSelectEditChecklist(
                                    "justif_prod",
                                    date.date_ID
                                  );
                                  setTimeout(() => {
                                    const input = document.getElementById(
                                      `justif_prod_${date.date_ID}`
                                    );
                                    if (input) input.focus();
                                  }, 0);
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  handleEditChecklist(
                                    "facture_contrat",
                                    newChecklist.facture_contrat,
                                    date.date_ID
                                  );
                                }
                              }}
                            ></input>
                          </td>
                        ) : (
                          <td
                            className={`col-checklist ${getStatusClass(
                              date.checklist.facture_contrat
                            )}`}
                            onClick={() => {
                              handleSelectEditChecklist(
                                "facture_contrat",
                                date.date_ID
                              );
                              setTimeout(() => {
                                const input = document.getElementById(
                                  `facture_contrat_${date.date_ID}`
                                );
                                if (input) input.focus();
                              }, 0);
                            }}
                          >
                            {date.checklist.facture_contrat}
                          </td>
                        )}
                        <td className="center col-archive">
                          {date.checklist.archive_status === "true" ? (
                            <i
                              onClick={() => handleOutArchive(date.date_ID)}
                              className="fa-solid fa-box-archive cursor"
                            ></i>
                          ) : (
                            <i
                              onClick={() => handleArchive(date.date_ID)}
                              className="fa-regular fa-folder-open cursor"
                            ></i>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        );
      })}
    </>
  );
};

export default Checklist;
