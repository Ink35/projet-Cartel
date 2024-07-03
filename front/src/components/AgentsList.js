import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgent,
  getAllAgents,
  updateAgent,
} from "../actions/agent.action";
import { selectAgents } from "../reducers/agent.reducer";
import { selectDates } from "../reducers/date.reducer";
import { getAllDates } from "../actions/date.action";
import TableAgents from "./TableAgents";

const AgentsList = () => {
  const dispatch = useDispatch();
  const agents = useSelector(selectAgents);
  const dates = useSelector(selectDates);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [agent_id, setAgent_id] = useState(null);
  const [agentUpdateId, setAgentUpdateId] = useState(null);
  const [agentNameUpdate, setAgentNameUpdate] = useState(null);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllAgents());
  }, [dispatch]);

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const filteredAgents =
    agents &&
    agents.filter((agent) =>
      agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentAgents =
    filteredAgents && filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredAgents && filteredAgents.length / agentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdateAgent = (id, name) => {
    setAgentUpdateId(id);
    setAgentNameUpdate(name);
  };

  const handleValidate = () => {
    const newAgent = new FormData();
    newAgent.append("agent_ID", agentUpdateId);
    newAgent.append("agent_name", agentNameUpdate);
    dispatch(updateAgent(newAgent)).then(() => {
      dispatch(getAllAgents());
      setAgentUpdateId(null);
    });
  };

  const handleAgentChange = (value) => {
    setAgentNameUpdate(value);
  };

  const handleDateByAgents = (id) => {
    setAgent_id(id);
  };

  const handleDeleteAgent = (id) => {
    const formAgent = new FormData();
    formAgent.append("agent_ID", id);
    dispatch(deleteAgent(formAgent)).then(() => {
      dispatch(getAllAgents());
    });
  };

  const handleCancel = () => {
    setAgentUpdateId(null);
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          agentholder="Recherche par nom de salle/festival ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-sm center">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Nombre(s) de date</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Date(s)</th>
          </tr>
        </thead>
        <tbody>
          {currentAgents &&
            currentAgents.map((agent, index) => (
              <tr key={agent.agent_ID}>
                {agent.agent_ID === agentUpdateId ? (
                  <input
                    type="text"
                    value={agentNameUpdate}
                    onChange={(e) => handleAgentChange(e.target.value)}
                  ></input>
                ) : (
                  <td>{agent.agent_name}</td>
                )}
                <td>
                  {dates &&
                    dates.length > 0 &&
                    dates.filter(
                      (date) => date.agent.agent_ID === agent.agent_ID
                    ).length}
                </td>
                <td>
                  {agent.agent_ID === agentUpdateId ? (
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
                        handleUpdateAgent(agent.agent_ID, agent.agent_name)
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
                    data-bs-target={`#modal-delete-agent${agent.agent_ID}`}
                  >
                    <i className="fa-regular fa-trash-can fa-lg"></i>
                  </button>

                  <div
                    className="modal fade"
                    id={`modal-delete-agent${agent.agent_ID}`}
                    tabIndex="-1"
                    aria-labelledby={`modal-delete-agent${agent.agent_ID}`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id={`modal-delete-agent${agent.agent_ID}`}
                          >
                            {agent.agent_name}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          Attention - Supprimer un Agent supprimera les salles
                          associées ! Vous devez supprimer les dates associées
                          avant de supprimer cet Agent !<br></br>
                          Nombre de dates restantes :{" "}
                          {dates &&
                            dates.filter(
                              (date) => date.agent.agent_ID === agent.agent_ID
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
                                (date) => date.agent.agent_ID === agent.agent_ID
                              ).length !== 0
                            }
                            onClick={() => handleDeleteAgent(agent.agent_ID)}
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
                    onClick={() => handleDateByAgents(agent.agent_ID)}
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
      {agent_id !== null && <TableAgents agent_id={agent_id} />}
    </>
  );
};

export default AgentsList;
