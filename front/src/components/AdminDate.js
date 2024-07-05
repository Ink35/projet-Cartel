import { useDispatch, useSelector } from "react-redux";
import { selectDates } from "../reducers/date.reducer";
import { useEffect, useState } from "react";
import { deleteDate, getAllDates, updateDate } from "../actions/date.action";
import "../styles/tableBooker.css";
import { selectAgents } from "../reducers/agent.reducer";
import { getAllAgents } from "../actions/agent.action";
import { selectArtistes } from "../reducers/artiste.reducer";
import { selectBookers } from "../reducers/booker.reducer";
import { selectCities } from "../reducers/city.reducer";
import { selectPlaces } from "../reducers/place.reducer";
import { getAllArtistes } from "../actions/artiste.action";
import { getAllBookers } from "../actions/booker.action";
import he from "he";
import { getAllCities } from "../actions/city.action";
import { getAllPlaces } from "../actions/place.action";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

const AdminDate = ({ type, id }) => {
  const dispatch = useDispatch();
  const dates = useSelector(selectDates);
  const agents = useSelector(selectAgents);
  const artistes = useSelector(selectArtistes);
  const users = useSelector(selectBookers);
  const cities = useSelector(selectCities);
  const places = useSelector(selectPlaces);
  const [typeName, setTypeName] = useState("");
  const [actualType, setActualType] = useState(null);
  const [typePath, setTypePath] = useState("");
  const [editDateID, setEditDateID] = useState("");
  const [selectedCity, setSelectedCity] = useState();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedArtiste, setSelectedArtiste] = useState(null);

  const filteredPlacesEdit =
    selectedCity && places
      ? selectedCity === null
        ? places
        : places.filter((place) => place.city.city_ID === selectedCity.value)
      : [];

  const artistesOptions =
    artistes &&
    artistes.map((artiste) => ({
      value: artiste.artiste_ID,
      label: he.decode(artiste.artiste_name).toUpperCase(),
    }));

  const citiesOptions =
    cities &&
    cities.map((city) => ({
      value: city.city_ID,
      label: city.city_name.toUpperCase(),
    }));

  const placesOptions =
    filteredPlacesEdit &&
    filteredPlacesEdit.map((place) => ({
      value: place.place_ID,
      label: place.place_name.toUpperCase(),
    }));

  const bookerOptions =
    users &&
    users.map((booker) => ({
      value: booker.user_ID,
      label: booker.user_name.toUpperCase(),
    }));

  const agentOptions =
    agents &&
    agents.map((agent) => ({
      value: agent.agent_ID,
      label: agent.agent_name.toUpperCase(),
    }));

  useEffect(() => {
    if (type === "agent") {
      const agent = agents && agents.find((agent) => agent.agent_ID === id);
      setActualType(agent);
      if (agent) setTypeName(agent.agent_name);
      setTypePath("agent.agent_ID");
    }

    if (type === "artiste") {
      const artiste =
        artistes && artistes.find((artiste) => artiste.artiste_ID === id);
      setActualType(artiste);
      if (artiste) setTypeName(artiste.artiste_name);
      setTypePath("artiste.artiste_ID");
    }

    if (type === "salle") {
      const place = places && places.find((place) => place.place_ID === id);
      setActualType(place);
      if (place) setTypeName(place.place_name);
      setTypePath("place.place_ID");
    }

    if (type === "city") {
      const city = cities && cities.find((city) => city.city_ID === id);
      setActualType(city);
      if (city) setTypeName(city.city_name);
      setTypePath("city.city_ID");
    }
    if (type === "booker") {
      const user = users && users.find((user) => user.user_ID === id);
      setActualType(user);
      if (user) setTypeName(user.user_name);
      setTypePath("user.user_ID");
    }
  }, [type, id, agents, artistes, places, cities]);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllArtistes());
    dispatch(getAllCities());
    dispatch(getAllPlaces());
    dispatch(getAllBookers());
    dispatch(getAllAgents());
  }, [dispatch]);

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((value, key) => value && value[key], obj);
  };

  const handleDeleteDate = (date_ID) => {
    const formDate = new FormData();
    formDate.append("date_ID", date_ID);
    dispatch(deleteDate(formDate)).then(() => {
      dispatch(getAllDates());
    });
  };

  const handleEditID = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    setEditDateID(date_ID);
    if (dateEdit) {
      setSelectedCity({
        value: dateEdit.city.city_ID,
        label: dateEdit.city.city_name,
      });
      setSelectedPlace({
        value: dateEdit.place.place_ID,
        label: dateEdit.place.place_name,
      });
      setSelectedUser({
        value: dateEdit.user.user_ID,
        label: dateEdit.user.user_name,
      });
      setSelectedAgent({
        value: dateEdit.agent.agent_ID,
        label: dateEdit.agent.agent_name,
      });
      setSelectedArtiste({
        value: dateEdit.artiste.artiste_ID,
        label: dateEdit.artiste.artiste_name,
      });
    }
  };

  const handleEditDate = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", dateEdit.comment);
    formDate.append("status", dateEdit.status);
    formDate.append("capacity", dateEdit.capacity);
    formDate.append("ticket_sold", dateEdit.ticket_sold);
    formDate.append("ca", dateEdit.ca);
    formDate.append("result_net", dateEdit.result_net);
    formDate.append("city_name", selectedCity.label);
    formDate.append("artiste_name", selectedArtiste.label);
    formDate.append("place_name", selectedPlace.label);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", selectedUser.value);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", selectedAgent.label);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setEditDateID(null);
  };

  const handleSelectTypeChange = (type, selectedOption) => {
    if (type === "city") {
      setSelectedCity(selectedOption);
      setSelectedPlace(null);
    }
    if (type === "artiste") {
      setSelectedArtiste(selectedOption);
    }
    if (type === "place") {
      setSelectedPlace(selectedOption);
    }
    if (type === "booker") {
      setSelectedUser(selectedOption);
    }
    if (type === "agent") {
      setSelectedAgent(selectedOption);
    }
  };

  const handleCancel = () => {
    setEditDateID(null);
  };

  const customStyleSelect = {
    container: (provided) => ({
      ...provided,
      minWidth: "100px",
      width: "100%",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: "2px",
      height: "0px",
      width: "0px",
      visibility: "hidden",
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: "2px",
    }),
  };

  return (
    <>
      <h2>Date de {actualType != null && typeName}</h2>
      <table className="table table-striped table-hove table-sm center">
        <thead>
          <tr>
            <th>Date</th>
            <th>Artiste</th>
            <th>Ville</th>
            <th>Salle</th>
            <th>Agent</th>
            <th>Booker</th>
            <th>Commentaire</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dates &&
            dates.map((date, index) => {
              if (getNestedValue(date, typePath) === id) {
                return (
                  <tr key={index}>
                    <td>{date.date}</td>
                    {date.date_ID === editDateID ? (
                      <td>
                        <CreatableSelect
                          isClearable
                          value={selectedArtiste}
                          onChange={(selectedOption) =>
                            handleSelectTypeChange("artiste", selectedOption)
                          }
                          options={artistesOptions}
                          styles={customStyleSelect}
                          placeholder="Sélectionner un Artiste"
                        />
                      </td>
                    ) : (
                      <td>{date.artiste.artiste_name}</td>
                    )}
                    {date.date_ID === editDateID ? (
                      <td>
                        <CreatableSelect
                          isClearable
                          value={selectedCity}
                          onChange={(selectedOption) =>
                            handleSelectTypeChange("city", selectedOption)
                          }
                          options={citiesOptions}
                          styles={customStyleSelect}
                          placeholder="Sélectionner une Ville"
                        />
                      </td>
                    ) : (
                      <td>{date.city.city_name}</td>
                    )}
                    {date.date_ID === editDateID ? (
                      <td>
                        <CreatableSelect
                          isClearable
                          value={selectedPlace}
                          onChange={(selectedOption) =>
                            handleSelectTypeChange("place", selectedOption)
                          }
                          options={placesOptions}
                          styles={customStyleSelect}
                          placeholder="Sélectionner une Salle/Festival"
                        />
                      </td>
                    ) : (
                      <td>{date.place.place_name}</td>
                    )}

                    {date.date_ID === editDateID ? (
                      <td>
                        <CreatableSelect
                          isClearable
                          value={selectedAgent}
                          onChange={(selectedOption) =>
                            handleSelectTypeChange("agent", selectedOption)
                          }
                          options={agentOptions}
                          styles={customStyleSelect}
                          placeholder="Sélectionner un Agent"
                        />
                      </td>
                    ) : (
                      <td>{date.agent.agent_name}</td>
                    )}
                    {date.date_ID === editDateID ? (
                      <td>
                        <Select
                          isClearable
                          value={selectedUser}
                          onChange={(selectedOption) =>
                            handleSelectTypeChange("booker", selectedOption)
                          }
                          options={bookerOptions}
                          styles={customStyleSelect}
                          placeholder="Sélectionner un Booker"
                        />
                      </td>
                    ) : (
                      <td>{date.user.user_name}</td>
                    )}
                    <td>{date.comment}</td>
                    <td>
                      {date.date_ID === editDateID ? (
                        <>
                          <button
                            type="button"
                            className="btn-classique"
                            onClick={() => handleEditDate(date.date_ID)}
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
                          onClick={() => handleEditID(date.date_ID)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-delete"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-delete-date${date.date_ID}`}
                      >
                        <i className="fa-regular fa-trash-can fa-lg"></i>
                      </button>

                      <div
                        className="modal fade"
                        id={`#modal-delete-date${date.date_ID}`}
                        tabIndex="-1"
                        aria-labelledby={`modal-delete-date${date.date_ID}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={`modal-delete-date${date.date_ID}`}
                              >
                                {date.date} - {date.artiste.artiste_name} -{" "}
                                {date.agent.agent_name}
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              Etes-vous sûr de vouloir supprimer cette date ?
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
                                onClick={() => handleDeleteDate(date.date_ID)}
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }
              return null;
            })}
        </tbody>
      </table>
    </>
  );
};

export default AdminDate;
