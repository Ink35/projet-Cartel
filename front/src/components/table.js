<table className="table table-sm table-bordered table-hover">
  <thead className="thead-dark">
    <tr>
      <th>Date</th>
      <th>Artiste</th>
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
          <td>{facture.date.date}</td>
          <td>{facture.artiste.artiste_name}</td>
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
                Confirm
              </button>
            </td>
          ) : (
            <td
              className="col-client"
              onClick={() => {
                handleSelectEditFacture("client_name", facture.facture_ID);
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
                onChange={(event) => handleChange("facture_number", event)}
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
                handleSelectEditFacture("facture_number", facture.facture_ID);
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
                onChange={(event) => handleChange("facture_link", event)}
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
              <a href={facture.facture_link} target="_blank" rel="noreferrer">
                Voir
              </a>
              <i
                onClick={() => {
                  handleSelectEditFacture("facture_link", facture.facture_ID);
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
                onChange={(event) => handleChange("acompte_status", event)}
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
                facture.acompte_status.includes("OK") ? "table-success" : ""
              }`}
              onClick={() => {
                handleSelectEditFacture("acompte_status", facture.facture_ID);
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
                onChange={(event) => handleChange("date_relance", event)}
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
                handleSelectEditFacture("date_relance", facture.facture_ID);
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
                onChange={(event) => handleChange("commentary", event)}
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
                handleSelectEditFacture("commentary", facture.facture_ID);
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
</table>;
