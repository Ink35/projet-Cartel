import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllArtistes } from "../actions/artiste.action";
import { selectArtistes } from "../reducers/artiste.reducer";
import { selectCities } from "../reducers/city.reducer";
import { getAllCities } from "../actions/city.action";
import { selectPlaces } from "../reducers/place.reducer";
import { getAllPlaces } from "../actions/place.action";
import { selectTypes } from "../reducers/type.reducer";
import { getAllTypes } from "../actions/type.action";
import { selectSubtypes } from "../reducers/subtype.reducer";
import { getAllSubtypes } from "../actions/subtype.action";
import { createDateUpdate, getAllDates } from "../actions/date.action";
import { getAllStructures } from "../actions/structure.action";
import { selectStructures } from "../reducers/structure.reducer";
import { selectCurrentUser } from "../reducers/auth.reducer";
import ResultTableSuivi from "./ResultTableSuivi";
import { selectAgents } from "../reducers/agent.reducer";
import { getAllAgents } from "../actions/agent.action";

const Form = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedArtiste, setSelectedArtiste] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [status, setStatus] = useState("confirmed");
  const [comment, setComment] = useState("");
  const [submitCount, setSubmitCount] = useState(0);

  const dispatch = useDispatch();
  const artistes = useSelector(selectArtistes);
  const cities = useSelector(selectCities);
  const places = useSelector(selectPlaces);
  const types = useSelector(selectTypes);
  const subtypes = useSelector(selectSubtypes);
  const structures = useSelector(selectStructures);
  const currentUser = useSelector(selectCurrentUser);
  const agents = useSelector(selectAgents);

  const filteredPlaces =
    selectedCity === null
      ? places
      : places &&
        places.filter((place) => place.city.city_ID === selectedCity.value);

  const filteredSubtypes =
    selectedType === null
      ? subtypes
      : subtypes.filter(
          (subtype) => subtype.type.type_ID === selectedType.value
        );

  useEffect(() => {
    dispatch(getAllArtistes());
    dispatch(getAllCities());
    dispatch(getAllPlaces());
    dispatch(getAllTypes());
    dispatch(getAllSubtypes());
    dispatch(getAllStructures());
    dispatch(getAllAgents());
  }, [dispatch, submitCount]);

  const artistesOptions =
    artistes &&
    artistes.map((artiste) => ({
      value: artiste.artiste_ID,
      label: artiste.artiste_name.toUpperCase(),
    }));

  const citiesOptions =
    cities &&
    cities.map((city) => ({
      value: city.city_ID,
      label: city.city_name.toUpperCase(),
    }));

  const placesOptions =
    filteredPlaces &&
    filteredPlaces.map((place) => ({
      value: place.place_ID,
      label: place.place_name.toUpperCase(),
    }));

  const typesOptions =
    types &&
    types.map((type) => ({
      value: type.type_ID,
      label: type.type.toUpperCase(),
    }));

  const subtypesOptions =
    filteredSubtypes &&
    filteredSubtypes.map((subtype) => ({
      value: subtype.subtype_ID,
      label: subtype.subtype.toUpperCase(),
    }));

  const structuresOptions =
    structures &&
    structures.map((structure) => ({
      value: structure.structure_ID,
      label: structure.structure_name.toUpperCase(),
    }));

  const agentsOptions =
    agents &&
    agents.map((agent) => ({
      value: agent.agent_ID,
      label: agent.agent_name.toUpperCase(),
    }));

  const handleSelectArtisteChange = (selectedOption) => {
    setSelectedArtiste(selectedOption);
  };

  const handleSelectCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setSelectedPlace(null);
  };

  const handleSelectPlaceChange = (selectedOption) => {
    setSelectedPlace(selectedOption);
  };

  const handleSelectTypeChange = (selectedOption) => {
    setSelectedType(selectedOption);
    setSelectedSubtype(null);
  };

  const handleSelectSubtypeChange = (selectedOption) => {
    setSelectedSubtype(selectedOption);
  };
  const handleSelectStructureChange = (selectedOption) => {
    setSelectedStructure(selectedOption);
  };

  const handleSelectAgentChange = (selectedOption) => {
    setSelectedAgent(selectedOption);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const formatDate = (date) => {
    // Vérifier si la date est au format Date
    if (!(date instanceof Date)) {
      // Si ce n'est pas le cas, retourner simplement la date sans la formater
      return date;
    }
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    const formDate = new FormData();
    formDate.append("date", formatDate(startDate));
    formDate.append("comment", comment);
    formDate.append("status", status);
    formDate.append("capacity", 0);
    formDate.append("ticket_sold", 0);
    formDate.append("ca", 0);
    formDate.append("result_net", 0);
    formDate.append("city_name", selectedCity.label);
    formDate.append("artiste_name", selectedArtiste.label);
    formDate.append("place_name", selectedPlace.label);
    formDate.append("structure_ID", selectedStructure.value);
    formDate.append("type_ID", selectedType.value);
    formDate.append("subtype_ID", selectedSubtype.value);
    formDate.append("user_ID", currentUser.user_ID);
    if (selectedAgent && selectedAgent.label === null) {
      setSelectedAgent({ label: "1" });
    }
    formDate.append("agent_name", selectedAgent ? selectedAgent.label : "1");
    if (selectedType.label === "production") {
      formDate.append("in_sale", "not_in_sale");
    } else {
      formDate.append("in_sale", "in_sale");
    }
    dispatch(createDateUpdate(formDate)).then((res) => {
      setSelectedArtiste({
        label: res.data.newDate.artiste.artiste_name,
        value: res.data.newDate.artiste.artiste_ID,
      });
    });
    setSelectedCity(null);
    setStartDate(null);
    setComment("");
    setSubmitCount(submitCount + 1);
    setTimeout(() => {
      const input = document.getElementById("datePicker");
      if (input) input.focus();
    }, 0);
  };

  return (
    <section>
      <div className="add-date-form">
        <CreatableSelect
          isClearable
          value={selectedArtiste}
          onChange={handleSelectArtisteChange}
          options={artistesOptions}
          placeholder="Sélectionner un artiste..."
        />
        <DatePicker
          showIcon
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          locale={fr}
          dateFormat="dd/MM/yyyy"
          id="datePicker"
        />
        <CreatableSelect
          isClearable
          value={selectedCity}
          onChange={handleSelectCityChange}
          options={citiesOptions}
          placeholder="Sélectionner une ville"
        />
        <CreatableSelect
          isClearable
          value={selectedPlace}
          onChange={handleSelectPlaceChange}
          options={placesOptions}
          placeholder="Sélectionner une Salle/Festival"
        />
        <Select
          value={selectedType}
          onChange={handleSelectTypeChange}
          options={typesOptions}
          placeholder="Sélectionner un type"
        />
        <Select
          value={selectedSubtype}
          onChange={handleSelectSubtypeChange}
          options={subtypesOptions}
          placeholder="Sélectionner un sous-type"
        />
        {selectedType && selectedType.label === "production" ? (
          <CreatableSelect
            isClearable
            value={selectedAgent}
            onChange={handleSelectAgentChange}
            options={agentsOptions}
            placeholder="Sélectionner un Agent"
          />
        ) : null}

        <Select
          value={selectedStructure}
          onChange={handleSelectStructureChange}
          options={structuresOptions}
          placeholder="Sélectionner la structure"
        />
      </div>
      <section className="select-com">
        <div className="form-radio">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio1"
              value="confirmed"
              checked={status === "confirmed"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inlineRadio1">
              Confirmé
            </label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio2"
              value="canceled"
              checked={status === "canceled"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Annulé
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio3"
              value="option"
              checked={status === "option"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inlineRadio3">
              Option
            </label>
          </div>
        </div>
        <div className="form-floating comments-area">
          <textarea
            style={{ height: "100px" }}
            className="form-control"
            placeholder="Ajouter un commentaire..."
            id="floatingTextarea"
            onChange={(e) => handleCommentChange(e.target.value)}
            value={comment}
          ></textarea>
          <label htmlFor="floatingTextarea">Commentaire</label>
        </div>

        <button
          className="btn-add-date"
          disabled={
            startDate === null ||
            selectedType === null ||
            selectedSubtype === null ||
            selectedArtiste === null ||
            selectedCity === null ||
            selectedPlace === null ||
            selectedStructure === null
              ? "disabled"
              : null
          }
          type="button"
          onClick={handleSubmit}
        >
          Ajouter Date
        </button>
      </section>
      {selectedArtiste !== null && selectedArtiste !== undefined ? (
        <ResultTableSuivi
          key={submitCount}
          page="suivi"
          selectedArtiste={selectedArtiste}
        />
      ) : null}
    </section>
  );
};

export default Form;
