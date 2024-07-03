import { useDispatch, useSelector } from "react-redux";
import { deleteDate, getAllDates, updateDate } from "../actions/date.action";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { selectDates } from "../reducers/date.reducer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Select from "react-select";
import { getAllArtistes } from "../actions/artiste.action";
import { selectArtistes } from "../reducers/artiste.reducer";
import { getAllCities } from "../actions/city.action";
import { selectCities } from "../reducers/city.reducer";
import { selectPlaces } from "../reducers/place.reducer";
import { selectTypes } from "../reducers/type.reducer";
import { selectSubtypes } from "../reducers/subtype.reducer";
import { selectStructures } from "../reducers/structure.reducer";
import { selectBookers } from "../reducers/booker.reducer";
import { getAllTypes } from "../actions/type.action";
import { getAllSubtypes } from "../actions/subtype.action";
import { getAllStructures } from "../actions/structure.action";
import { getAllPlaces } from "../actions/place.action";
import { getAllBookers } from "../actions/booker.action";
import makeAnimated from "react-select/animated";
import React from "react";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import ExcelDownloadButton from "./ExcelDownloadButton";
import SinglePageExcelDownloadButton from "./SinglePageExcelDownloadButton";
import { selectCurrentUser, selectIsLoggedIn } from "../reducers/auth.reducer";
import "../styles/resultTable.css";
import { selectAgents } from "../reducers/agent.reducer";
import { getAllAgents } from "../actions/agent.action";
import { updateChecklist } from "../actions/checklist.action";
import he from "he";

const ResultTableSuivi = ({ currentBooker, selectedArtiste, page }) => {
  //Dispatch + Selector
  const dispatch = useDispatch();
  const dates = useSelector(selectDates);
  const artistes = useSelector(selectArtistes);
  const cities = useSelector(selectCities);
  const places = useSelector(selectPlaces);
  const types = useSelector(selectTypes);
  const subtypes = useSelector(selectSubtypes);
  const structures = useSelector(selectStructures);
  const bookers = useSelector(selectBookers);
  const loggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const agents = useSelector(selectAgents);

  //UseState
  const [editDateId, setEditDateId] = useState();
  const [editCom, setEditCom] = useState();
  const [caID, setCaID] = useState(null);
  const [jaugeID, setJaugeID] = useState(null);
  const [resultID, setResultID] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [filteredDates, setFilteredDates] = useState(dates);
  const [selectedCity, setSelectedCity] = useState();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [ca, setCA] = useState(null);
  const [result, setResult] = useState(null);
  const [capacity, setCapacity] = useState(0);
  const [statusID, setStatusID] = useState(null);
  const [ticketSold, setTicketSold] = useState(null);
  const radioContainerRef = useRef(null);
  const jaugeContainerRef = useRef(null);
  const [dateToEdit, setDateToEdit] = useState();
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState();

  const [addPage, setAddPage] = useState(page);

  //Calcul pour les totaux CA et Result
  let total_ca_global = 0;
  let total_result_global = 0;

  //Pour l'ajout de date l'artiste en filter :
  const updateFilters = (selectedArtist) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      year: [],
      artistes: [selectedArtist],
      status: [],
    }));
  };
  //Pour l'ajout de date pour l'utilisateur en filter :
  const updateFiltersUser = (currentBooker) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      year: [],
      status: [],
      users: [currentBooker],
    }));
  };

  //Choix des colonnes pour le module Excel
  let columnForExcel;

  if (currentUser && currentUser.role === "booker") {
    columnForExcel = [
      { header: "Artiste", key: "artiste.artiste_name" },
      { header: "Date", key: "date" },
      { header: "Comment", key: "comment" },
      { header: "Status", key: "status" },
      { header: "En Vente", key: "checklist.in_sale" },
      { header: "City", key: "city.city_name" },
      { header: "Place", key: "place.place_name" },
      { header: "Structure", key: "structure.structure_name" },
      { header: "Type", key: "type.type" },
      { header: "Agent", key: "agent.agent_name" },
    ];
  } else if (
    currentUser &&
    (currentUser.role === "admin" ||
      currentUser.role === "compta" ||
      currentUser.role === "prod" ||
      currentUser.role === "dev")
  ) {
    columnForExcel = [
      { header: "Artiste", key: "artiste.artiste_name" },
      { header: "Date", key: "date" },
      { header: "Comment", key: "comment" },
      { header: "Status", key: "status" },
      { header: "En Vente", key: "checklist.in_sale" },
      { header: "Capacity", key: "capacity" },
      { header: "Ticket Sold", key: "ticket_sold" },
      { header: "CA", key: "ca" },
      { header: "Result Net", key: "result_net" },
      { header: "City", key: "city.city_name" },
      { header: "Place", key: "place.place_name" },
      { header: "Structure", key: "structure.structure_name" },
      { header: "Type", key: "type.type" },
      { header: "Agent", key: "agent.agent_name" },
    ];
  }

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

  //Option de filtre - avec Filtre par default YEAR et STATUS CONFIRMED
  const currentYear = new Date().getFullYear();

  const defaultYearOption = {
    value: currentYear,
    label: currentYear.toString(),
  };
  const [filters, setFilters] = useState({
    year: [defaultYearOption],
    month: "",
    status: [{ value: "confirmed", label: "Confirmé" }],
    cities: "",
    places: "",
    artistes: "",
    types: "",
    subtypes: "",
    structures: "",
    users: "",
    agents: "",
  });

  // Attente chargement des dispatch pour afficher les selecteurs et résultat pour évité les erreurs - Avec afficage d'un loading
  useEffect(() => {
    setLoading(true); // Définit loading sur true lorsque le composant est monté

    const promises = [
      dispatch(getAllDates()),
      dispatch(getAllArtistes()),
      dispatch(getAllCities()),
      dispatch(getAllPlaces()),
      dispatch(getAllTypes()),
      dispatch(getAllSubtypes()),
      dispatch(getAllStructures()),
      dispatch(getAllBookers()),
      dispatch(getAllAgents()),
    ];

    Promise.all(promises)
      .then(() => setLoading(false)) // Définit loading sur false une fois que toutes les promesses sont résolues
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors du chargement des données :",
          error
        );
        setLoading(false);
      });
  }, [dispatch]);

  // Affichage des dates filtré apres la récupération du dispatch des dates
  useEffect(() => {
    if (dates) {
      setFilteredDates(dateFiltering(dates, filters));
    }
  }, [filters, dates]);

  useEffect(() => {
    if (selectedArtiste) {
      updateFilters(selectedArtiste);
    }
  }, [selectedArtiste]);

  useEffect(() => {
    if (currentBooker) {
      updateFiltersUser(currentBooker);
    }
  }, [currentBooker]);

  // Gestion de fermeture des menu si clique ailleurs que l'endroit concerné
  const handleClickOutside = (event) => {
    if (
      radioContainerRef.current &&
      !radioContainerRef.current.contains(event.target)
    ) {
      setStatusID(null);
    }
    if (
      jaugeContainerRef.current &&
      !jaugeContainerRef.current.contains(event.target)
    ) {
      setJaugeID(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Majuscule sur la premiere lettre (BDD)
  const capitalizeFirstLetter = (str) => {
    if (typeof str !== "string" || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const filteredPlaces =
    filters.cities === null || filters.cities.length === 0
      ? places
      : places.filter((place) =>
          filters.cities.some((city) => city.value === place.city.city_ID)
        );

  const filteredPlacesEdit =
    selectedCity && places
      ? selectedCity === null
        ? places
        : places.filter((place) => place.city.city_ID === selectedCity.value)
      : [];

  const placesOptionsEdit =
    filteredPlacesEdit &&
    filteredPlacesEdit.map((place) => ({
      value: place.place_ID,
      label: place.place_name,
    }));

  const filteredSubtypes =
    filters.types && Array.isArray(filters.types)
      ? subtypes.filter((subtype) =>
          filters.types.some((type) => type.value === subtype.type.type_ID)
        )
      : subtypes;

  const filteredSubtypesEdit =
    selectedType && subtypes
      ? selectedType === null
        ? subtypes
        : subtypes.filter(
            (subtype) => subtype.type.type_ID === selectedType.value
          )
      : [];

  const subtypesOptionsEdit =
    filteredSubtypesEdit &&
    filteredSubtypesEdit.map((subtype) => ({
      value: subtype.subtype_ID,
      label: subtype.subtype,
    }));

  const allYears =
    dates && dates.map((date) => new Date(date.date).getFullYear());
  const uniqueYears = Array.from(new Set(allYears));

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
      return true;
    });
  }

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

  const yearOptions =
    uniqueYears &&
    uniqueYears.map((year) => ({
      value: year,
      label: year.toString(),
    }));

  const artistesOptions =
    artistes &&
    artistes.map((artiste) => ({
      value: artiste.artiste_ID,
      label: he.decode(artiste.artiste_name),
    }));

  const citiesOptions =
    cities &&
    cities.map((city) => ({
      value: city.city_ID,
      label: city.city_name,
    }));

  const placesOptions =
    filteredPlaces &&
    filteredPlaces.map((place) => ({
      value: place.place_ID,
      label: place.place_name,
    }));

  const typesOptions =
    types &&
    types.map((type) => ({
      value: type.type_ID,
      label: capitalizeFirstLetter(type.type),
    }));

  const structuresOptions =
    structures &&
    structures.map((structure) => ({
      value: structure.structure_ID,
      label: capitalizeFirstLetter(structure.structure_name),
    }));

  const subtypesOptions =
    filteredSubtypes &&
    filteredSubtypes.map((subtype) => ({
      value: subtype.subtype_ID,
      label: capitalizeFirstLetter(subtype.subtype),
    }));

  const statusOptions = [
    { value: "confirmed", label: "Confirmé" },
    { value: "canceled", label: "Annulé" },
    { value: "option", label: "Option" },
  ];

  const animatedComponents = makeAnimated();

  const bookerOptions =
    bookers &&
    bookers.map((booker) => ({
      value: booker.user_ID,
      label: booker.user_name,
    }));

  const agentOptions =
    agents &&
    agents.map((agent) => ({
      value: agent.agent_ID,
      label: agent.agent_name,
    }));

  const datesByArtiste = filteredDates
    ? filteredDates.reduce((acc, date) => {
        const artisteName = date.artiste.artiste_name;
        if (!acc[artisteName]) {
          acc[artisteName] = [date];
        } else {
          acc[artisteName].push(date);
        }
        return acc;
      }, {})
    : {};

  // Trier les groupements par artiste_name
  const sortedDatesByArtiste = Object.entries(datesByArtiste)
    .sort((a, b) => {
      const nameA = a[0].toLowerCase();
      const nameB = b[0].toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  // Convertir l'objet trié en tableau de valeurs
  const sortedDates = Object.values(sortedDatesByArtiste);

  function formatFrenchDate(dateString) {
    const dateObject = new Date(dateString);
    return format(dateObject, "dd MMMM yyyy", { locale: fr });
  }

  const handleChangeStatus = (date_ID) => {
    setStatusID(date_ID);
  };

  const handleJaugeChange = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    setCapacity(dateEdit.capacity);
    setTicketSold(dateEdit.ticket_sold);
    setJaugeID(date_ID);
  };

  const handleMouseEnterComment = (date_ID) => {
    setDisplayModal(date_ID);
  };

  const handleCaChange = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    setCA(dateEdit.ca);
    setCaID(date_ID);
  };

  const handleResultChange = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    setResult(dateEdit.result_net);
    setResultID(date_ID);
  };

  const handleSelectChange = (property, selectedOption) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [property]: selectedOption,
    }));
  };

  const handleSelectPlaceChange = (selectedOption) => {
    setSelectedPlace(selectedOption);
  };

  const handleSelectCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setSelectedPlace(null);
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

  const handleSelectUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleSelectStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleChangeComment = (event) => {
    setSelectedComment({
      label: event.target.value,
      value: event.target.value,
    });
  };

  const handleSelectAgentChange = (selectedOption) => {
    setSelectedAgent(selectedOption);
  };

  const handleValueCa = (event) => {
    setCA(event.target.value);
  };

  const handleValueResult = (event) => {
    setResult(event.target.value);
  };

  const handleTicketSoldChange = (event) => {
    setTicketSold(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };

  const handleMisEnVente = (checklist_ID) => {
    const misEnVente = new FormData();
    misEnVente.append("checklist_ID", checklist_ID);
    misEnVente.append("in_sale", "in_sale");
    dispatch(updateChecklist(misEnVente)).then(() => {
      dispatch(getAllDates());
    });
  };

  const handlePasMisEnVente = (checklist_ID) => {
    const misEnVente = new FormData();
    misEnVente.append("checklist_ID", checklist_ID);
    misEnVente.append("in_sale", "not_in_sale");
    dispatch(updateChecklist(misEnVente)).then(() => {
      dispatch(getAllDates());
    });
  };

  const handleDateEdit = (selectedDate) => {
    const dateEdit = dates.find((date) => date.date_ID === selectedDate);
    setDateToEdit(dateEdit);
    setEditDateId(selectedDate);
    setStartDate(dateEdit.date);
    setSelectedCity({
      value: dateEdit.city.city_ID,
      label: dateEdit.city.city_name,
    });
    setSelectedPlace({
      value: dateEdit.place.place_ID,
      label: dateEdit.place.place_name,
    });
    setSelectedType({
      value: dateEdit.type.type_ID,
      label: capitalizeFirstLetter(dateEdit.type.type),
    });
    setSelectedSubtype({
      value: dateEdit.subtype.subtype_ID,
      label: capitalizeFirstLetter(dateEdit.subtype.subtype),
    });
    setSelectedStructure({
      value: dateEdit.structure.structure_ID,
      label: dateEdit.structure.structure_name,
    });
    setSelectedStatus({
      value: dateEdit.status,
      label: dateEdit.status,
    });
    setSelectedUser({
      value: dateEdit.user.user_ID,
      label: dateEdit.user.user_name,
    });
    setSelectedAgent({
      value: dateEdit.agent.agent_ID,
      label: dateEdit.agent.agent_name,
    });
    setSelectedComment({
      value: dateEdit.comment,
      label: dateEdit.comment,
    });
    setCapacity({
      value: dateEdit.capacity,
      label: dateEdit.capacity,
    });
    setCA(dateEdit.ca);
    setResult(dateEdit.result_net);
    setCapacity(dateEdit.capacity);
    setTicketSold(dateEdit.ticket_sold);
    setSelectedAgent({
      value: dateEdit.agent.agent_ID,
      label: dateEdit.agent.agent_name,
    });
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

  const handleDateEditConfirm = () => {
    const formDate = new FormData();
    formDate.append("date", formatDate(startDate));
    formDate.append("comment", selectedComment.value);
    formDate.append("status", selectedStatus.value);
    formDate.append("capacity", capacity);
    formDate.append("ticket_sold", ticketSold);
    formDate.append("ca", ca);
    formDate.append("result_net", result);
    formDate.append("city_name", selectedCity.label);
    formDate.append("artiste_name", dateToEdit.artiste.artiste_name);
    formDate.append("place_name", selectedPlace.label);
    formDate.append("structure_ID", selectedStructure.value);
    formDate.append("type_ID", selectedType.value);
    formDate.append("subtype_ID", selectedSubtype.value);
    formDate.append("user_ID", selectedUser.value);
    formDate.append("calendar_ID", dateToEdit.calendar_ID);
    formDate.append("date_ID", dateToEdit.date_ID);
    formDate.append("artiste_ID", dateToEdit.artiste.artiste_ID);
    formDate.append("agent_name", selectedAgent.label);
    formDate.append("checklist_ID", dateToEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setEditDateId(null);
    setDateToEdit(null);
  };

  const handleEditCom = (date_ID) => {
    const dateEdit = dates.find((date) => date.date_ID === date_ID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", selectedComment.value);
    formDate.append("status", dateEdit.status);
    formDate.append("capacity", dateEdit.capacity);
    formDate.append("ticket_sold", dateEdit.ticket_sold);
    formDate.append("ca", dateEdit.ca);
    formDate.append("result_net", dateEdit.result_net);
    formDate.append("city_name", dateEdit.city.city_name);
    formDate.append("artiste_name", dateEdit.artiste.artiste_name);
    formDate.append("place_name", dateEdit.place.place_name);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", dateEdit.user.user_ID);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", dateEdit.agent.agent_name);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setEditCom(null);
  };

  const handleStatusChangeAlone = (dateID, status) => {
    const dateEdit = dates.find((date) => date.date_ID === dateID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", dateEdit.comment);
    formDate.append("status", status);
    formDate.append("capacity", dateEdit.capacity);
    formDate.append("ticket_sold", dateEdit.ticket_sold);
    formDate.append("ca", dateEdit.ca);
    formDate.append("result_net", dateEdit.result_net);
    formDate.append("city_name", dateEdit.city.city_name);
    formDate.append("artiste_name", dateEdit.artiste.artiste_name);
    formDate.append("place_name", dateEdit.place.place_name);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", dateEdit.user.user_ID);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", dateEdit.agent.agent_name);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setStatusID(null);
  };

  const handleJaugeChangeAlone = (dateID, jauge, ticket) => {
    const dateEdit = dates.find((date) => date.date_ID === dateID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", dateEdit.comment);
    formDate.append("status", dateEdit.status);
    formDate.append("capacity", jauge);
    formDate.append("ticket_sold", ticket);
    formDate.append("ca", dateEdit.ca);
    formDate.append("result_net", dateEdit.result_net);
    formDate.append("city_name", dateEdit.city.city_name);
    formDate.append("artiste_name", dateEdit.artiste.artiste_name);
    formDate.append("place_name", dateEdit.place.place_name);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", dateEdit.user.user_ID);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", dateEdit.agent.agent_name);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setJaugeID(null);
  };

  const handleCaChangeAlone = (dateID, ca) => {
    const dateEdit = dates.find((date) => date.date_ID === dateID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", dateEdit.comment);
    formDate.append("status", dateEdit.status);
    formDate.append("capacity", dateEdit.capacity);
    formDate.append("ticket_sold", dateEdit.ticket_sold);
    formDate.append("ca", ca);
    formDate.append("result_net", dateEdit.result_net);
    formDate.append("city_name", dateEdit.city.city_name);
    formDate.append("artiste_name", dateEdit.artiste.artiste_name);
    formDate.append("place_name", dateEdit.place.place_name);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", dateEdit.user.user_ID);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", dateEdit.agent.agent_name);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setCaID(null);
  };

  const handleResultChangeAlone = (dateID, result) => {
    const dateEdit = dates.find((date) => date.date_ID === dateID);
    const formDate = new FormData();
    formDate.append("date", dateEdit.date);
    formDate.append("comment", dateEdit.comment);
    formDate.append("status", dateEdit.status);
    formDate.append("capacity", dateEdit.capacity);
    formDate.append("ticket_sold", dateEdit.ticket_sold);
    formDate.append("ca", dateEdit.ca);
    formDate.append("result_net", result);
    formDate.append("city_name", dateEdit.city.city_name);
    formDate.append("artiste_name", dateEdit.artiste.artiste_name);
    formDate.append("place_name", dateEdit.place.place_name);
    formDate.append("structure_ID", dateEdit.structure.structure_ID);
    formDate.append("type_ID", dateEdit.type.type_ID);
    formDate.append("subtype_ID", dateEdit.subtype.subtype_ID);
    formDate.append("user_ID", dateEdit.user.user_ID);
    formDate.append("calendar_ID", dateEdit.calendar_ID);
    formDate.append("date_ID", dateEdit.date_ID);
    formDate.append("artiste_ID", dateEdit.artiste.artiste_ID);
    formDate.append("agent_name", dateEdit.agent.agent_name);
    formDate.append("checklist_ID", dateEdit.checklist.checklist_ID);
    dispatch(updateDate(formDate));
    setResultID(null);
  };

  const handleCancelEdit = () => {
    setEditDateId(null);
    setDateToEdit(null);
  };

  const handleDateDelete = (selectedDate) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette date ?"
    );
    if (confirmed) {
      const formDate = new FormData();
      formDate.append("date_ID", selectedDate);
      dispatch(deleteDate(formDate)).then(() => {
        dispatch(getAllDates());
        setEditDateId(null);
      });
    }
  };

  if (!loggedIn) {
    return <Navigate to="/sign_in" />;
  }

  if (currentUser && currentUser.role === "booker ext") {
    return <Navigate to="/mes_bookings" />;
  }

  const getOrderedDatesForArtist = (datesForArtist, addPage) => {
    return addPage === "suivi"
      ? datesForArtist.slice().reverse()
      : datesForArtist.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
  };

  return (
    <>
      {loading ? (
        <>
          <div className="loading-logo">
            <img
              src={process.env.PUBLIC_URL + "/img/logo-loading.gif"}
              alt="loading screen"
            />
          </div>
        </>
      ) : (
        <>
          {addPage && addPage === "suivi" ? null : (
            <section className="filterBar">
              <Select
                isMulti
                components={animatedComponents}
                closeMenuOnSelect={true}
                name="Artistes"
                value={filters.artistes}
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
                name="Year"
                components={animatedComponents}
                defaultValue={yearOptions[0]}
                value={filters.year}
                onChange={(selectedOption) =>
                  handleSelectChange("year", selectedOption)
                }
                options={yearOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Année(s)"
              />
              <Select
                isMulti
                name="Month"
                components={animatedComponents}
                value={filters.month}
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
                name="Cities"
                components={animatedComponents}
                value={filters.cities}
                onChange={(selectedOption) =>
                  handleSelectChange("cities", selectedOption)
                }
                options={citiesOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Ville(s)"
              />
              <Select
                isMulti
                name="Places"
                components={animatedComponents}
                value={filters.places}
                onChange={(selectedOption) =>
                  handleSelectChange("places", selectedOption)
                }
                options={placesOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Salle(s)/Festival"
              />
              <Select
                isMulti
                name="Types"
                components={animatedComponents}
                value={filters.types}
                onChange={(selectedOption) =>
                  handleSelectChange("types", selectedOption)
                }
                options={typesOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Type(s)"
              />
              <Select
                isMulti
                name="Agents"
                components={animatedComponents}
                value={filters.agents}
                onChange={(selectedOption) =>
                  handleSelectChange("agents", selectedOption)
                }
                options={agentOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Agent(s)"
              />
              <Select
                isMulti
                name="Subtypes"
                components={animatedComponents}
                value={filters.subtypes}
                onChange={(selectedOption) =>
                  handleSelectChange("subtypes", selectedOption)
                }
                options={subtypesOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Sous-type(s)"
              />
              <Select
                isMulti
                name="Structures"
                components={animatedComponents}
                value={filters.structures}
                onChange={(selectedOption) =>
                  handleSelectChange("structures", selectedOption)
                }
                options={structuresOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Structure(s)"
              />
              <Select
                isMulti
                name="Status"
                components={animatedComponents}
                defaultValue={statusOptions[0]}
                value={filters.status}
                onChange={(selectedOption) =>
                  handleSelectChange("status", selectedOption)
                }
                options={statusOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Status"
              />
              {addPage && addPage === "booker" ? null : (
                <Select
                  isMulti
                  name="Booker"
                  components={animatedComponents}
                  value={filters.users}
                  onChange={(selectedOption) =>
                    handleSelectChange("users", selectedOption)
                  }
                  options={bookerOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Booker(s)"
                />
              )}
            </section>
          )}
          <div className="excel-button">
            <ExcelDownloadButton data={sortedDates} columns={columnForExcel} />
            <SinglePageExcelDownloadButton
              data={sortedDates}
              columns={columnForExcel}
            />
          </div>
          {sortedDates &&
            sortedDates.map((datesForArtist, index) => {
              let total_ca_artist = 0;
              let total_result_artist = 0;
              return (
                <div key={index}>
                  <article className="artist-block">
                    {datesForArtist[0].artiste.img_url && (
                      <img
                        alt={he.decode(datesForArtist[0].artiste.artiste_name)}
                        className="profil-pic"
                        src={datesForArtist[0].artiste.img_url}
                      />
                    )}
                    <div className="artist-block-name">
                      <h2>
                        {he.decode(datesForArtist[0].artiste.artiste_name)}
                      </h2>
                      <p>Nombre(s) de date(s) : {datesForArtist.length}</p>
                    </div>
                  </article>

                  <table
                    className="table table-striped table-hover table-responsive col-test"
                    // data-bs-theme="dark"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Ville</th>
                        <th scope="col">Salle</th>
                        <th scope="col">Type</th>
                        <th scope="col">Sous-type</th>
                        <th scope="col">Agent</th>
                        <th scope="col">Structure</th>
                        <th scope="col">Status</th>
                        <th scope="col">En Vente</th>
                        {addPage && addPage === "booker" ? null : (
                          <th scope="col">Booker</th>
                        )}
                        {currentUser &&
                        (currentUser.role === "admin" ||
                          currentUser.role === "compta" ||
                          currentUser.role === "prod" ||
                          currentUser.role === "dev") ? (
                          <>
                            <th scope="col">Jauge</th>
                            <th scope="col">CA HT</th>
                            <th scope="col">Résultat HT</th>
                          </>
                        ) : null}

                        <th className="col-end" scope="col"></th>
                        <th className="col-end" scope="col"></th>
                        <th className="col-end" scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getOrderedDatesForArtist(datesForArtist, addPage).map(
                        (date) => {
                          total_ca_artist += date.ca; // Ajout du CA de la date au total de l'artiste
                          total_result_artist += date.result_net;
                          total_ca_global += date.ca;
                          total_result_global += date.result_net;
                          return (
                            <React.Fragment key={date.date_ID}>
                              <tr>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <DatePicker
                                      showIcon
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      locale={fr}
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  ) : (
                                    formatFrenchDate(date.date)
                                  )}
                                </td>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <CreatableSelect
                                        isClearable
                                        defaultValue={{
                                          value: dateToEdit.city.city_ID,
                                          label: dateToEdit.city.city_name,
                                        }}
                                        value={selectedCity}
                                        onChange={handleSelectCityChange}
                                        options={citiesOptions}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner une ville"
                                      />
                                    </>
                                  ) : (
                                    date.city.city_name
                                  )}
                                </td>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <CreatableSelect
                                        isClearable
                                        value={selectedPlace}
                                        onChange={handleSelectPlaceChange}
                                        options={placesOptionsEdit}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner une salle/festival"
                                      />
                                    </>
                                  ) : (
                                    date.place.place_name
                                  )}
                                </td>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <Select
                                        isClearable
                                        value={selectedType}
                                        onChange={handleSelectTypeChange}
                                        options={typesOptions}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner un type"
                                      />
                                    </>
                                  ) : (
                                    capitalizeFirstLetter(date.type.type)
                                  )}
                                </td>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <Select
                                        isClearable
                                        value={selectedSubtype}
                                        onChange={handleSelectSubtypeChange}
                                        options={subtypesOptionsEdit}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner un sous-type"
                                      />
                                    </>
                                  ) : (
                                    capitalizeFirstLetter(date.subtype.subtype)
                                  )}
                                </td>
                                {date.type.type === "production" ? (
                                  editDateId === date.date_ID ? (
                                    <CreatableSelect
                                      isClearable
                                      value={selectedAgent}
                                      onChange={handleSelectAgentChange}
                                      options={agentOptions}
                                      styles={customStyleSelect}
                                      placeholder="Sélectionner un Agent"
                                    />
                                  ) : (
                                    <td className="agent-div">
                                      {date.agent.agent_name}
                                    </td>
                                  )
                                ) : (
                                  <td></td>
                                )}
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <Select
                                        id="select-edit"
                                        isClearable
                                        value={selectedStructure}
                                        onChange={handleSelectStructureChange}
                                        options={structuresOptions}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner une structure"
                                      />
                                    </>
                                  ) : date.structure.structure_name ===
                                    "Cartel Concerts" ? (
                                    <img
                                      alt="Cartel Concert Logo"
                                      className="logo-structure"
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/Cconcert.png"
                                      }
                                    ></img>
                                  ) : (
                                    <img
                                      alt="Cartel BZH Logo"
                                      className="logo-structure"
                                      src={
                                        process.env.PUBLIC_URL + "/img/Cbzh.png"
                                      }
                                    ></img>
                                  )}
                                </td>
                                <td>
                                  {editDateId === date.date_ID ? (
                                    <>
                                      <Select
                                        isClearable
                                        value={selectedStatus}
                                        onChange={handleSelectStatusChange}
                                        options={statusOptions}
                                        styles={customStyleSelect}
                                        placeholder="Sélectionner un status"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {statusID === date.date_ID ? (
                                        <div ref={radioContainerRef}>
                                          <i
                                            className="fa-solid fa-circle-check fa-lg"
                                            style={{ color: "#63E6BE" }}
                                            onClick={() =>
                                              handleStatusChangeAlone(
                                                date.date_ID,
                                                "confirmed"
                                              )
                                            }
                                          ></i>

                                          <i
                                            className="fa-solid fa-circle-xmark fa-lg"
                                            style={{ color: "#ff1f1f" }}
                                            onClick={() =>
                                              handleStatusChangeAlone(
                                                date.date_ID,
                                                "canceled"
                                              )
                                            }
                                          ></i>

                                          <i
                                            className="fa-solid fa-circle-question fa-lg"
                                            style={{ color: "#FFD43B" }}
                                            onClick={() =>
                                              handleStatusChangeAlone(
                                                date.date_ID,
                                                "option"
                                              )
                                            }
                                          ></i>
                                        </div>
                                      ) : (
                                        <>
                                          {date.status === "confirmed" ? (
                                            <i
                                              className="fa-solid fa-circle-check cursor"
                                              style={{ color: "#63E6BE" }}
                                              onClick={() =>
                                                handleChangeStatus(date.date_ID)
                                              }
                                            ></i>
                                          ) : null}
                                          {date.status === "canceled" ? (
                                            <i
                                              className="fa-solid fa-circle-xmark cursor"
                                              style={{ color: "#ff1f1f" }}
                                              onClick={() =>
                                                handleChangeStatus(date.date_ID)
                                              }
                                            ></i>
                                          ) : null}
                                          {date.status === "option" ? (
                                            <i
                                              className="fa-solid fa-circle-question cursor"
                                              style={{ color: "#FFD43B" }}
                                              onClick={() =>
                                                handleChangeStatus(date.date_ID)
                                              }
                                            ></i>
                                          ) : null}
                                        </>
                                      )}
                                    </>
                                  )}
                                </td>
                                {date.type.type === "production" ? (
                                  <td className="col-end">
                                    {date.checklist.in_sale ===
                                    "not_in_sale" ? (
                                      <i
                                        onClick={() =>
                                          handleMisEnVente(
                                            date.checklist.checklist_ID
                                          )
                                        }
                                        className="fa-solid fa-circle-xmark cursor"
                                        style={{ color: "#ff1f1f" }}
                                      ></i>
                                    ) : (
                                      <i
                                        onClick={() =>
                                          handlePasMisEnVente(
                                            date.checklist.checklist_ID
                                          )
                                        }
                                        className="fa-solid fa-circle-check cursor"
                                        style={{ color: "#63E6BE" }}
                                      ></i>
                                    )}
                                  </td>
                                ) : (
                                  <td></td>
                                )}

                                {addPage && addPage === "booker" ? null : (
                                  <td>
                                    {editDateId === date.date_ID ? (
                                      <>
                                        <Select
                                          isClearable
                                          value={selectedUser}
                                          onChange={handleSelectUserChange}
                                          options={bookerOptions}
                                          styles={customStyleSelect}
                                          placeholder="Sélectionner un booker"
                                        />
                                      </>
                                    ) : (
                                      date.user.user_name
                                    )}
                                  </td>
                                )}
                                {currentUser &&
                                (currentUser.role === "admin" ||
                                  currentUser.role === "compta" ||
                                  currentUser.role === "prod" ||
                                  currentUser.role === "dev") ? (
                                  editDateId === date.date_ID ? (
                                    <>
                                      <td>
                                        <div className="input-group input-group-sm mb-3">
                                          <span
                                            className="input-group-text"
                                            id="inputGroup-sizing-sm"
                                          >
                                            Jauge
                                          </span>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={capacity}
                                            onChange={handleCapacityChange}
                                            aria-label="Sizing example input"
                                            aria-describedby="inputGroup-sizing-sm"
                                          ></input>
                                        </div>
                                        <div className="input-group input-group-sm mb-3">
                                          <span
                                            className="input-group-text"
                                            id="inputGroup-sizing-sm"
                                          >
                                            Sold
                                          </span>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={ticketSold}
                                            onChange={handleTicketSoldChange}
                                            aria-label="Sizing example input"
                                            aria-describedby="inputGroup-sizing-sm"
                                          ></input>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="input-group mb-3">
                                          <input
                                            type="number"
                                            value={ca}
                                            onChange={handleValueCa}
                                            className="form-control"
                                            aria-label="ca"
                                            aria-describedby="basic-addon2"
                                          ></input>
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            €
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="input-group mb-3">
                                          <input
                                            type="number"
                                            value={result}
                                            onChange={handleValueResult}
                                            className="form-control"
                                            aria-label="resultat net"
                                            aria-describedby="basic-addon2"
                                          ></input>
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            €
                                          </span>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {jaugeID === date.date_ID ? (
                                        <td>
                                          <div
                                            className="input-group input-group-sm mb-3"
                                            ref={jaugeContainerRef}
                                          >
                                            <span
                                              className="input-group-text"
                                              id="inputGroup-sizing-sm"
                                            >
                                              Jauge
                                            </span>
                                            <input
                                              type="number"
                                              value={capacity}
                                              onChange={handleCapacityChange}
                                              className="form-control"
                                              id={`jaugeInput_${date.date_ID}`}
                                            ></input>
                                            <span
                                              className="input-group-text"
                                              id="inputGroup-sizing-sm"
                                            >
                                              Sold
                                            </span>
                                            <input
                                              type="number"
                                              className="form-control"
                                              value={ticketSold}
                                              onChange={handleTicketSoldChange}
                                              onBlur={() =>
                                                handleJaugeChangeAlone(
                                                  jaugeID,
                                                  capacity,
                                                  ticketSold
                                                )
                                              }
                                            ></input>
                                            <button
                                              className="btn btn-outline-secondary"
                                              type="button"
                                              id="button-addon2"
                                              onClick={() =>
                                                handleJaugeChangeAlone(
                                                  jaugeID,
                                                  capacity,
                                                  ticketSold
                                                )
                                              }
                                            >
                                              Validé
                                            </button>
                                          </div>
                                        </td>
                                      ) : (
                                        <td
                                          onClick={() => {
                                            handleJaugeChange(date.date_ID);
                                            setTimeout(() => {
                                              const input =
                                                document.getElementById(
                                                  `jaugeInput_${date.date_ID}`
                                                );
                                              if (input) input.focus();
                                            }, 0);
                                          }}
                                        >
                                          <div
                                            className="progress cursor"
                                            role="progressbar"
                                            aria-label="Remplissage"
                                            aria-valuenow={
                                              isNaN(
                                                date.ticket_sold / date.capacity
                                              )
                                                ? 0
                                                : Math.ceil(
                                                    (date.ticket_sold /
                                                      date.capacity) *
                                                      100
                                                  )
                                            }
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                          >
                                            <div
                                              className="progress-bar bg-info text-dark cursor"
                                              style={{
                                                width: `${
                                                  isNaN(
                                                    date.ticket_sold /
                                                      date.capacity
                                                  )
                                                    ? 0
                                                    : Math.ceil(
                                                        (date.ticket_sold /
                                                          date.capacity) *
                                                          100
                                                      )
                                                }%`,
                                              }}
                                            >
                                              {isNaN(
                                                date.ticket_sold / date.capacity
                                              )
                                                ? 0
                                                : Math.ceil(
                                                    (date.ticket_sold /
                                                      date.capacity) *
                                                      100
                                                  )}
                                              %
                                            </div>
                                          </div>
                                        </td>
                                      )}
                                      {caID === date.date_ID ? (
                                        <td>
                                          <form className="form-floating">
                                            <input
                                              className="form-control"
                                              type="number"
                                              value={ca}
                                              onChange={handleValueCa}
                                              onBlur={() =>
                                                handleCaChangeAlone(caID, ca)
                                              }
                                              onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                  event.preventDefault(); // Empêche le comportement par défaut de la touche "Entrée"
                                                  handleCaChangeAlone(caID, ca);
                                                }
                                              }}
                                              id={`caInput_${date.date_ID}`}
                                            ></input>
                                            <label
                                              htmlFor={`caInput_${date.date_ID}`}
                                            >
                                              Chiffre d'affaire
                                            </label>
                                          </form>
                                        </td>
                                      ) : (
                                        <td
                                          className="number cursor"
                                          onClick={() => {
                                            handleCaChange(date.date_ID);
                                            setTimeout(() => {
                                              const input =
                                                document.getElementById(
                                                  `caInput_${date.date_ID}`
                                                );
                                              if (input) input.focus();
                                            }, 0);
                                          }}
                                        >
                                          {date.ca.toLocaleString("fr-FR")}€
                                        </td>
                                      )}
                                      {resultID === date.date_ID ? (
                                        <td>
                                          <form className="form-floating">
                                            <input
                                              className="form-control"
                                              type="number"
                                              value={result}
                                              onChange={handleValueResult}
                                              onBlur={() =>
                                                handleResultChangeAlone(
                                                  resultID,
                                                  result
                                                )
                                              }
                                              onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                  event.preventDefault(); // Empêche le comportement par défaut de la touche "Entrée"
                                                  handleResultChangeAlone(
                                                    resultID,
                                                    result
                                                  );
                                                }
                                              }}
                                              id={`resultInput_${date.date_ID}`}
                                            ></input>
                                            <label
                                              htmlFor={`resultInput_${date.date_ID}`}
                                            >
                                              Résultat HT
                                            </label>
                                          </form>
                                        </td>
                                      ) : (
                                        <td
                                          className="number cursor"
                                          onClick={() => {
                                            handleResultChange(date.date_ID);
                                            setTimeout(() => {
                                              const input =
                                                document.getElementById(
                                                  `resultInput_${date.date_ID}`
                                                );
                                              if (input) input.focus();
                                            }, 0);
                                          }}
                                        >
                                          {date.result_net.toLocaleString(
                                            "fr-FR"
                                          )}
                                          €
                                        </td>
                                      )}
                                    </>
                                  )
                                ) : null}

                                <td className="col-end">
                                  {date.comment === "" ? (
                                    <>
                                      {editDateId === date.date_ID ? (
                                        <button
                                          onMouseEnter={() =>
                                            handleMouseEnterComment(
                                              date.date_ID
                                            )
                                          }
                                          type="button"
                                          data-bs-toggle="modal"
                                          data-bs-target={`#modal${date.date_ID}`}
                                        >
                                          <i className="fa-regular fa-comment"></i>
                                        </button>
                                      ) : null}
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onMouseEnter={() =>
                                        handleMouseEnterComment(date.date_ID)
                                      }
                                      data-bs-toggle="modal"
                                      data-bs-target={`#modal${date.date_ID}`}
                                    >
                                      <i className="fa-regular fa-comment"></i>
                                    </button>
                                  )}
                                  {displayModal === date.date_ID ? (
                                    <div
                                      className="modal fade"
                                      id={`modal${date.date_ID}`}
                                      tabIndex="-1"
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1
                                              className="modal-title fs-5"
                                              id="exampleModalLabel"
                                            >
                                              Commentaire -
                                              {formatFrenchDate(date.date)} -{" "}
                                              {he.decode(
                                                date.artiste.artiste_name
                                              )}
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            ></button>
                                          </div>
                                          <div className="modal-body">
                                            {editCom === date.date_ID ? (
                                              <div className="form-floating">
                                                <textarea
                                                  className="form-control"
                                                  placeholder="Ajouter/Modifier un Commentaire"
                                                  id="floatingTextarea2"
                                                  style={{ height: "100px" }}
                                                  value={selectedComment.value}
                                                  onChange={handleChangeComment}
                                                ></textarea>
                                                <label htmlFor="floatingTextarea2">
                                                  Ajouter/Modifier un
                                                  Commentaire
                                                </label>
                                              </div>
                                            ) : date.comment === "" ? (
                                              <p className="commentaire-section">
                                                pas de commentaire
                                              </p>
                                            ) : (
                                              <p className="commentaire-section">
                                                {date.comment}
                                              </p>
                                            )}
                                          </div>
                                          <div className="modal-footer">
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              data-bs-dismiss="modal"
                                            >
                                              Close
                                            </button>
                                            {editCom === date.date_ID ? (
                                              <button
                                                className="btn btn-success"
                                                onClick={() =>
                                                  handleEditCom(date.date_ID)
                                                }
                                                data-bs-dismiss="modal"
                                              >
                                                Confirmez
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                  setSelectedComment({
                                                    value: date.comment,
                                                    label: date.comment,
                                                  });
                                                  setEditCom(date.date_ID);
                                                }}
                                              >
                                                Edit Commentaire
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </td>
                                <td>
                                  <div className="button-section">
                                    {dateToEdit &&
                                    dateToEdit.date_ID === date.date_ID ? (
                                      <>
                                        <button
                                          disabled={
                                            startDate === null ||
                                            selectedType === null ||
                                            selectedSubtype === null ||
                                            selectedUser === null ||
                                            selectedCity === null ||
                                            selectedPlace === null ||
                                            selectedStructure === null
                                              ? "disabled"
                                              : null
                                          }
                                          type="button"
                                          className="btn btn-success"
                                          onClick={handleDateEditConfirm}
                                        >
                                          <i className="fa-solid fa-check"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-warning"
                                          onClick={handleCancelEdit}
                                        >
                                          <i className="fa-solid fa-xmark"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-warning edit-button"
                                        onClick={() =>
                                          handleDateEdit(date.date_ID)
                                        }
                                      >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger edit-button"
                                    onClick={() =>
                                      handleDateDelete(date.date_ID)
                                    }
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                  {currentUser &&
                  (currentUser.role === "admin" ||
                    currentUser.role === "compta" ||
                    currentUser.role === "prod" ||
                    currentUser.role === "dev") ? (
                    <section className="result-table-div">
                      <table className="table table-responsive result-table table-bordered">
                        <thead>
                          <tr>
                            <th>Chiffre d'affaire HT</th>
                            <th>Résultat HT</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          <tr>
                            <td className="number">
                              {total_ca_artist.toLocaleString("fr-FR")}€
                            </td>
                            <td className="number">
                              {total_result_artist.toLocaleString("fr-FR")}€
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </section>
                  ) : null}
                </div>
              );
            })}
          {currentUser &&
          (currentUser.role === "admin" ||
            currentUser.role === "compta" ||
            currentUser.role === "prod" ||
            currentUser.role === "dev") &&
          ((filters && filters.artistes.length === 0) ||
            filters.artistes.length >= 2) ? (
            <section className="global-result">
              <table className="table-bordered table table-danger">
                <thead>
                  <tr>
                    <th>Total CA HT</th>
                    <th>Total RESULTAT HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="number">
                      {total_ca_global.toLocaleString("fr-FR")}€
                    </td>
                    <td className="number">
                      {total_result_global.toLocaleString("fr-FR")}€
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          ) : null}
        </>
      )}
    </>
  );
};

export default ResultTableSuivi;
