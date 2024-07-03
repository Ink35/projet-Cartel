import { useDispatch, useSelector } from "react-redux";
import { selectFactures } from "../reducers/facture.reducer";
import { useEffect } from "react";
import { deleteFacture, getAllFactures } from "../actions/facture.action";
import "../styles/tableBooker.css";
import { selectClients } from "../reducers/client.reducer";
import { getAllClients } from "../actions/client.action";

const TableClients = (client_id) => {
  const dispatch = useDispatch();
  const factures = useSelector(selectFactures);
  const clients = useSelector(selectClients);
  const actualClient =
    clients &&
    clients.find((client) => client.client_ID === client_id.client_id);

  useEffect(() => {
    dispatch(getAllFactures());
    dispatch(getAllClients());
  }, [dispatch]);

  const handleDeleteFacture = (facture_ID) => {
    const formFacture = new FormData();
    formFacture.append("facture_ID", facture_ID);
    dispatch(deleteFacture(formFacture)).then(() => {
      dispatch(getAllFactures());
    });
  };

  return (
    <>
      <h2>Facture de {actualClient != null && actualClient.client_name}</h2>
      <table className="table table-striped table-hove table-sm center">
        <thead>
          <tr>
            <th>N°Facture</th>
            <th>Artiste</th>
            <th>Lien Facture</th>
            <th>Commentaire</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {factures &&
            factures.map((facture, index) => {
              if (facture.client.client_ID === client_id.client_id) {
                return (
                  <tr key={index}>
                    <td>{facture.facture_number}</td>
                    <td>{facture.artiste.artiste_name}</td>
                    <td>
                      <a href={facture.facture_link} target="_blank">
                        Lien
                      </a>
                    </td>
                    <td>{facture.commentary}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-delete"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-delete-facture${facture.facture_ID}`}
                      >
                        <i className="fa-regular fa-trash-can fa-lg"></i>
                      </button>

                      <div
                        className="modal fade"
                        id={`modal-delete-facture${facture.facture_ID}`}
                        tabIndex="-1"
                        aria-labelledby={`modal-delete-facture${facture.facture_ID}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={`modal-delete-facture${facture.facture_ID}`}
                              >
                                {facture.facture} -{" "}
                                {facture.artiste.artiste_name} -{" "}
                                {facture.client.client_name} -{" "}
                                {facture.artiste.artiste_name}
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              Etes vous sur de vouloir supprimer cette facture ?
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
                                onClick={() =>
                                  handleDeleteFacture(facture.facture_ID)
                                }
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

export default TableClients;
