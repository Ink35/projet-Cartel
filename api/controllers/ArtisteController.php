<?php 

class ArtisteController extends AbstractController {

    private ArtisteManager $am;

    public function __construct()
    {
        $this->am = new ArtisteManager();
    }

    public function findAll() {
        $artistes = $this->am->findAll();
        if ($artistes != null) {
            $artistesArray = [];
            foreach ($artistes as $artiste) {
                $newArtiste = $artiste->toArray();
                $artistesArray[] = $newArtiste;
            }
            $this->render(["artistes"=> $artistesArray]);
        }
    }

    public function createArtiste(array $post) {
        $artiste = $this->am->findByName(htmlspecialchars($post["artiste_name"]));
        if ($artiste === null) {
            $artiste = new Artiste(htmlspecialchars($post["artiste_name"]));
            $newArtiste = $this->am->createArtiste($artiste);
            $this->render(["success"=> true, "newArtiste" => $newArtiste->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "Artiste déja dans la BDD" ]);
        }

        
    }

    public function updateArtiste(array $post) {
        $artiste = $this->am->findById($post["artiste_ID"]);
        if ($artiste !== null) {
            $artiste->setArtiste_name(htmlspecialchars($post["artiste_name"]));
            $artiste->setImg_url(htmlspecialchars($post["img_url"]));
            $newArtiste = $this->am->editArtiste($artiste);
            $this->render(["success" => true, "editedArtiste"=> $newArtiste->toArray()]);
        }

    }

    public function deleteArtiste(array $post) {
        $artiste = $this->am->findById($post["artiste_ID"]);
        if ($artiste !== null) {
            $this->am->deleteArtiste($artiste);
        }
    }
}