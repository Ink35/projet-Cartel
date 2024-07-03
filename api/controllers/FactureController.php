<?php 

class FactureController extends AbstractController {
    private ArtisteManager $am;
    private DateManager $dm;
    private FactureManager $fm;
    private ClientManager $cm;

    public function __construct()
    {
        $this->am = new ArtisteManager();
        $this->dm = new DateManager();
        $this->cm = new ClientManager();
        $this->fm = new FactureManager();
    }

    public function findAll() {
        $factures = $this->fm->findAll();
        if ($factures !== null) {
            $facturesArray = [];
            foreach($factures as $facture) {
                $newFacture = $facture->toArray();
                $facturesArray[] = $newFacture;
            }
            $this->render(["factures" => $facturesArray]);
        }
    }

    public function createFacture(array $post) {
        try {
            error_log('Début de createFacture');
            error_log('Données reçues: ' . json_encode($post));
    
            $client = new Client($post["client_name"]);
            $clientChecked = $this->cm->createClient($client);
            error_log('Client créé: ' . json_encode($clientChecked));
    
            $facture = new Facture(
                $clientChecked,
                $post["facture_number"],
                $post["facture_link"],
                $post["acompte_status"],
                $post["date_relance"],
                $post["commentary"],
                $post["archive_status"]
            );
    
            if ($post["artiste_ID"] !== null) {
                $artiste = $this->am->findById($post["artiste_ID"]);
                error_log('Artiste trouvé: ' . json_encode($artiste));
            } else {
                $artiste = null;
                error_log('Aucun artiste ID fourni');
            }
    
            if (isset($post["date_ID"]) && $post["date_ID"] !== null) {
                $date = $this->dm->findById($post["date_ID"]);
                $facture->setDate($date);
                error_log('Date trouvée: ' . json_encode($date));
            } else {
                $date = null;
                error_log('Aucune date ID fournie');
            }
    
            $facture->setArtiste($artiste);
    
            $this->fm->createFacture($facture);
            error_log('Facture créée: ' . json_encode($facture));
    
            $this->render(["success" => true]);
            error_log('Réponse envoyée avec succès');
        } catch (Exception $e) {
            error_log('Erreur lors de la création de la facture: ' . $e->getMessage());
            $this->render(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
    

    public function editFacture(array $post) {
        $facture = $this->fm->findById($post["facture_ID"]);
        if (isset($post["client_ID"])) {
            $client = $this->cm->findById($post["client_ID"]);
        }
        if (isset($post["client_name"]) && $post["client_name"] !== null) {
            $client = new Client($post["client_name"]);
            $client = $this->cm->createClient($client);
        }
        if ($post["artiste_ID"] !== null) {
            $artiste = $this->am->findById($post["artiste_ID"]);
        } else {
            $artiste = null;
        }
        if (isset($post["date_ID"])) {
            $date = $this->dm->findById($post["date_ID"]);
        } else {
            $date = null;
        }
        if ($facture !== null) {
            $facture->setClient($client);
            $facture->setFacture_number($post["facture_number"]);
            $facture->setFacture_link($post["facture_link"]);
            $facture->setAcompte_status($post["acompte_status"]);
            $facture->setDate_relance($post["date_relance"]);
            $facture->setCommentary($post["commentary"]);
            $facture->setArchive_status($post["archive_status"]);
            $facture->setArtiste($artiste);
            $facture->setDate($date);
            $facture->setId($post["facture_ID"]);
            
            $newFacture = $this->fm->editFacture($facture);
            $this->render(["success" => true]);
        }
        else {
            $this->render(["success" => false, "error_message" => "facture doesnt exist"]);
        }
    }

    public function deleteFacture(array $post) {
        $facture = $this->fm->findById($post["facture_ID"]);
        if ($facture !== null) {
            $this->fm->deleteFacture($facture);
            $this->render(["success" => true]);
        }

    }
}