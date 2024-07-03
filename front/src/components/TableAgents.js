import { useDispatch, useSelector } from "react-redux";
import { selectDates } from "../reducers/date.reducer";
import { useEffect } from "react";
import { deleteDate, getAllDates } from "../actions/date.action";
import "../styles/tableBooker.css";
import { selectAgents } from "../reducers/agent.reducer";
import { getAllAgents } from "../actions/agent.action";

const TableAgents = (agent_id) => {
  const dispatch = useDispatch();
  const dates = useSelector(selectDates);
  const agents = useSelector(selectAgents);
  const actualAgent =
    agents && agents.find((agent) => agent.agent_ID === agent_id.agent_id);

  useEffect(() => {
    dispatch(getAllDates());
    dispatch(getAllAgents());
  }, [dispatch]);

  const handleDeleteDate = (date_ID) => {
    const formDate = new FormData();
    formDate.append("date_ID", date_ID);
    dispatch(deleteDate(formDate)).then(() => {
      dispatch(getAllDates());
    });
  };

  return (
    <>
      <h2>Date de {actualAgent != null && actualAgent.agent_name}</h2>
      <table className="table table-striped table-hove table-sm center">
        <thead>
          <tr>
            <th>Date</th>
            <th>Artiste</th>
            <th>Ville</th>
            <th>Salle</th>
            <th>Type</th>
            <th>Sous-Type</th>
            <th>Structure</th>
            <th>Commentaire</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dates &&
            dates.map((date, index) => {
              if (date.agent.agent_ID === agent_id.agent_id) {
                return (
                  <tr key={index}>
                    <td>{date.date}</td>
                    <td>{date.artiste.artiste_name}</td>
                    <td>{date.city.city_name}</td>
                    <td>{date.place.place_name}</td>
                    <td>{date.type.type}</td>
                    <td>{date.subtype.subtype}</td>
                    <td>{date.structure.structure_name}</td>
                    <td>{date.comment}</td>
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
                        id={`modal-delete-date${date.date_ID}`}
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
                                {date.agent.agent_name} -{" "}
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
                              Etes vous sur de vouloir supprimer cette date ?
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

export default TableAgents;
