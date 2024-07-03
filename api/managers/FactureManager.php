<?php 

class FactureManager extends AbstractManager {

    private ClientManager $cm;
    private DateManager $dm;
    private ArtisteManager $am;
    protected PDO $db;

    public function __construct()
    {
        $this->cm = new ClientManager();
        $this->dm = new DateManager();
        $this->am = new ArtisteManager();
        $connexion = "mysql:host=".$_ENV["DB_HOST"].";port=3306;charset=".$_ENV["DB_CHARSET"].";dbname=".$_ENV["DB_NAME"];
        $this->db = new PDO(
            $connexion,
            $_ENV["DB_USER"],
            $_ENV["DB_PASSWORD"]
        );
    }

    public function findAll() {
        $query = $this->db->prepare("SELECT * FROM facture");
        $query->execute();
        $factures = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($factures !== null ){
            $facturesArray = [];
            foreach($factures as $facture) {
                $client = $this->cm->findById($facture["client_ID"]);
                $newFacture = new Facture($client,$facture["facture_number"],$facture["facture_link"],$facture["acompte_status"],$facture["date_relance"],$facture["commentary"],$facture["archive_status"]);
                if($facture["date_ID"] !== null) {
                   $date = $this->dm->findById($facture["date_ID"]);
                   $newFacture->setDate($date);
                }
                if ($facture["artiste_ID"] !== null) {
                    $artiste = $this->am->findById($facture["artiste_ID"]);
                    $newFacture->setArtiste($artiste);
                }
                $newFacture->setId($facture["facture_ID"]);
                $facturesArray[] = $newFacture;
            }
            return $facturesArray;
        }
    }

    public function findById(int $id) {
        $query = $this->db->prepare("SELECT * FROM facture WHERE facture_ID = :facture_ID");
        $parameters = [
            "facture_ID" => $id,
        ];
        $query->execute($parameters);
        $facture = $query->fetch(PDO::FETCH_ASSOC);
        if ($facture !== null) {
            $client = $this->cm->findById($facture["client_ID"]);
                $newFacture = new Facture($client,$facture["facture_number"],$facture["facture_link"],$facture["acompte_status"],$facture["date_relance"],$facture["commentary"],$facture["archive_status"]);
                if($facture["date_ID"] !== null) {
                   $date = $this->dm->findById($facture["date_ID"]);
                   $newFacture->setDate($date);
                }
                if ($facture["artiste_ID"] !== null) {
                    $artiste = $this->am->findById($facture["artiste_ID"]);
                    $newFacture->setArtiste($artiste);
                }
                $newFacture->setId($facture["facture_ID"]);
                return $newFacture;
        } else {
            return null;
        }
    }

    public function createFacture(Facture $facture) :?Facture {
        $query = $this->db->prepare("INSERT INTO facture (date_ID, artiste_ID, client_ID, facture_number, facture_link, acompte_status, date_relance, commentary, archive_status) 
                                    VALUES (:date_ID, :artiste_ID, :client_ID, :facture_number, :facture_link, :acompte_status, :date_relance, :commentary, :archive_status)");
        $parameters = [
        "client_ID" => $facture->getClient()->getId(),
        "facture_number" => $facture->getFacture_number(),
        "facture_link" => $facture->getFacture_link(),
        "acompte_status" => $facture->getAcompte_status(),
        "date_relance" => $facture->getDate_relance(),
        "commentary" => $facture->getCommentary(),
        "archive_status" => $facture->getArchive_status(),
        ];

        if ($facture->getDate() !== null) {
            $parameters["date_ID"] = $facture->getDate()->getId();
        } else {
            $parameters["date_ID"] = null; 
        }

        if ($facture->getArtiste() !== null) {
            $parameters["artiste_ID"] = $facture->getArtiste()->getId();
        } else {
            $parameters["artiste_ID"] = null;
        }

        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        return $this->findById($lastId);

    }

    public function editFacture(Facture $facture) {
        $query = $this->db->prepare("UPDATE facture 
                SET date_ID = :date_ID, artiste_ID = :artiste_ID, client_ID = :client_ID, facture_number = :facture_number, facture_link = :facture_link, acompte_status = :acompte_status, date_relance = :date_relance, commentary = :commentary, archive_status = :archive_status WHERE facture_ID = :facture_ID");
        $parameters = [
            "client_ID" => $facture->getClient()->getId(),
            "facture_number" => $facture->getFacture_number(),
            "facture_link" => $facture->getFacture_link(),
            "acompte_status" => $facture->getAcompte_status(),
            "date_relance" => $facture->getDate_relance(),
            "commentary" => $facture->getCommentary(),
            "archive_status" => $facture->getArchive_status(),
            "facture_ID" => $facture->getId(),
            ];
    
            if ($facture->getDate() !== null) {
                $parameters["date_ID"] = $facture->getDate()->getId();
            } else {
                $parameters["date_ID"] = null; 
            }
    
            if ($facture->getArtiste() !== null) {
                $parameters["artiste_ID"] = $facture->getArtiste()->getId();
            } else {
                $parameters["artiste_ID"] = null;
            }
    
            $query->execute($parameters);
            return  $this->findById($facture->getId());
    }

    public function deleteFacture(Facture $facture) :void {
        $query = $this->db->prepare("DELETE FROM facture WHERE facture_ID = :facture_ID");
        $parameters = [
            "facture_ID" => $facture->getId(),
        ];
        $query->execute($parameters);
    }
}