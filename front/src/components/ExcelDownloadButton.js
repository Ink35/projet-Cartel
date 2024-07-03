import React from "react";
import * as XLSX from "xlsx";

class ExcelDownloadButton extends React.Component {
  handleDownload(columns, data) {
    if (!Array.isArray(columns) || !Array.isArray(data)) {
      console.error("Columns and data must be arrays");
      return;
    }

    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();

    // Initialiser un objet pour stocker les sommes des colonnes sélectionnées
    const sum = {};

    // Pour chaque colonne
    columns.forEach((col) => {
      // Vérifier si la colonne est une colonne numérique à sommer
      if (col.sum && ["number", "currency"].includes(col.type)) {
        // Initialiser la somme à 0
        sum[col.header] = 0;

        // Pour chaque ensemble de données
        data.forEach((dataArray) => {
          if (Array.isArray(dataArray)) {
            dataArray.forEach((item) => {
              const nestedProperties = col.key.split(".");
              let value = item;
              nestedProperties.forEach((prop) => {
                if (value && value.hasOwnProperty(prop)) {
                  value = value[prop];
                } else {
                  value = undefined;
                }
              });

              // Si la valeur existe et est un nombre, l'ajouter à la somme
              if (!isNaN(value)) {
                sum[col.header] += parseFloat(value);
              }
            });
          }
        });
      }
    });

    // Pour chaque ensemble de données
    data.forEach((dataArray, index) => {
      if (Array.isArray(dataArray)) {
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

        // Créer une nouvelle feuille de calcul
        const worksheetData = filteredData.map((item) => Object.values(item));

        // Ajouter la somme au bas de la feuille
        const sumRow = columns.map((col) =>
          sum[col.header] !== undefined ? sum[col.header] : ""
        );
        worksheetData.push(sumRow);

        // Ajouter le titre de la feuille
        let sheetTitle =
          dataArray.length > 0 && dataArray[0].artiste
            ? dataArray[0].artiste.artiste_name
            : `Sheet${index + 1}`;
        if (sheetTitle.length > 31) {
          sheetTitle = sheetTitle.substring(0, 31);
        }

        const worksheet = XLSX.utils.aoa_to_sheet([
          columns.map((col) => col.header),
          ...worksheetData,
        ]);

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);
      }
    });

    // Écrire le workbook dans un fichier Excel
    XLSX.writeFile(workbook, "Booking Cartel.xlsx");
  }

  render() {
    return (
      <button
        onClick={() => this.handleDownload(this.props.columns, this.props.data)}
      >
        Télécharger Excel
      </button>
    );
  }
}

export default ExcelDownloadButton;
