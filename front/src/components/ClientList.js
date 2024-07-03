import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClient,
  getAllClients,
  updateClient,
} from "../actions/client.action";
import { selectClients } from "../reducers/client.reducer";
import { selectFactures } from "../reducers/facture.reducer";
import { getAllFactures } from "../actions/facture.action";
import TableClients from "./tableClients";

const ClientsList = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const factures = useSelector(selectFactures);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [client_id, setClient_id] = useState(null);
  const [clientUpdateId, setClientUpdateId] = useState(null);
  const [clientNameUpdate, setClientNameUpdate] = useState(null);
  const [clientURLUpdate, setClientURLUpdate] = useState(null);

  useEffect(() => {
    dispatch(getAllFactures());
    dispatch(getAllClients());
  }, [dispatch]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const filteredClients =
    clients &&
    clients.filter((client) =>
      client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentClients =
    filteredClients &&
    filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredClients && filteredClients.length / clientsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdateClient = (id, name) => {
    setClientUpdateId(id);
    setClientNameUpdate(name);
  };

  const handleValidate = () => {
    const newClient = new FormData();
    newClient.append("client_ID", clientUpdateId);
    newClient.append("client_name", clientNameUpdate);
    dispatch(updateClient(newClient)).then(() => {
      dispatch(getAllClients());
      setClientUpdateId(null);
    });
  };

  const handleClientChange = (value) => {
    setClientNameUpdate(value);
  };

  const handleFactureByClients = (id) => {
    setClient_id(id);
  };

  const handleDeleteClient = (id) => {
    const formClient = new FormData();
    formClient.append("client_ID", id);
    dispatch(deleteClient(formClient)).then(() => {
      dispatch(getAllClients());
    });
  };

  const handleCancel = () => {
    setClientUpdateId(null);
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-sm center">
        <thead>
          <tr>
            <th>Client</th>
            <th className="date-number">Nombre(s) de facture</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Facture(s)</th>
          </tr>
        </thead>
        <tbody>
          {currentClients &&
            currentClients.map(
              (client, index) =>
                client && (
                  <tr key={client.client_ID}>
                    {client.client_ID === clientUpdateId ? (
                      <input
                        type="text"
                        value={clientNameUpdate}
                        onChange={(e) => handleClientChange(e.target.value)}
                      ></input>
                    ) : (
                      <td>{client.client_name}</td>
                    )}
                    <td className="date-number">
                      {factures &&
                        factures.length > 0 &&
                        factures.filter(
                          (facture) =>
                            facture.client &&
                            facture.client.client_ID === client.client_ID
                        ).length}
                    </td>
                    <td>
                      {client.client_ID === clientUpdateId ? (
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
                            handleUpdateClient(
                              client.client_ID,
                              client.client_name
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
                        data-bs-target={`#modal-delete-client${client.client_ID}`}
                      >
                        <i className="fa-regular fa-trash-can fa-lg"></i>
                      </button>

                      <div
                        className="modal fade"
                        id={`modal-delete-client${client.client_ID}`}
                        tabIndex="-1"
                        aria-labelledby={`modal-delete-client${client.client_ID}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={`modal-delete-client${client.client_ID}`}
                              >
                                {client.client_name}
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              Vous devez supprimer les factures associées avant
                              de supprimer cette ville !<br></br>
                              Nombre de factures restantes :{" "}
                              {factures &&
                                factures.filter(
                                  (facture) =>
                                    facture.client &&
                                    facture.client.client_ID ===
                                      client.client_ID
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
                                  factures &&
                                  factures.filter(
                                    (facture) =>
                                      facture.client &&
                                      facture.client.client_ID ===
                                        client.client_ID
                                  ).length !== 0
                                }
                                onClick={() =>
                                  handleDeleteClient(client.client_ID)
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
                        onClick={() => handleFactureByClients(client.client_ID)}
                      >
                        <i className="fa-regular fa-calendar"></i>
                      </button>
                    </td>
                  </tr>
                )
            )}
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
      {client_id !== null && <TableClients client_id={client_id} />}
    </>
  );
};

export default ClientsList;
