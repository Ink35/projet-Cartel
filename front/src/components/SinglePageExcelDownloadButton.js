import React from "react";
import * as XLSX from "xlsx";

class SinglePageExcelDownloadButton extends React.Component {
  handleDownload(columns, data) {
    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();

    // Initialiser un objet pour stocker les sommes des colonnes sélectionnées
    const sum = {};

    // Initialiser un tableau pour stocker toutes les données filtrées
    const allData = [];

    // Pour chaque ensemble de données
    data.forEach((dataArray) => {
      // Filtrer les colonnes à afficher et renommer les colonnes
      const filteredData = dataArray.map((item) => {
        const filteredItem = {};
        columns.forEach((col) => {
          const nestedProperties = col.key.split(".");
          let value = item;
          nestedProperties.forEach((prop) => {
            if (value && value.hasOwnProperty(prop)) {
              value = value[prop];
            } else {
              value = undefined;
            }
          });
          filteredItem[col.header] = value;
        });
        return filteredItem;
      });

      // Ajouter les données filtrées au tableau de données globales
      allData.push(...filteredData);

      // Calculer les sommes des colonnes sélectionnées
      columns.forEach((col) => {
        if (col.sum && ["number", "currency"].includes(col.type)) {
          sum[col.header] =
            (sum[col.header] || 0) +
            filteredData.reduce((acc, item) => {
              const value = item[col.header];
              return acc + (isNaN(value) ? 0 : parseFloat(value));
            }, 0);
        }
      });
    });

    // Créer une feuille de calcul avec les données filtrées
    const worksheetData = allData.map((item) => Object.values(item));
    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.header),
      ...worksheetData,
    ]);

    // Ajouter la ligne des totaux à la fin de la feuille
    const sumRow = columns.map((col) =>
      sum[col.header] !== undefined ? sum[col.header] : ""
    );
    worksheetData.push(sumRow);

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    // Écrire le workbook dans un fichier Excel
    XLSX.writeFile(workbook, "Recap Single Page Cartel Concert.xlsx");
  }

  render() {
    return (
      <button
        onClick={() => this.handleDownload(this.props.columns, this.props.data)}
      >
        Télécharger Excel (Page Unique)
      </button>
    );
  }
}

export default SinglePageExcelDownloadButton;
