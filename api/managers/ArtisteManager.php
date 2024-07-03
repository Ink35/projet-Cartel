<?php 
class ArtisteManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM artistes");
        $query->execute();
        $artistes = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($artistes != null) {
            $artistesArray= [];
            foreach ($artistes as $artiste) {
                $newArtiste = new Artiste($artiste["artiste_name"]);
                if ($artiste["img_url"] !== null ) {
                    $newArtiste->setImg_url($artiste["img_url"]);
                }
                $newArtiste->setId($artiste["ID"]);
                $artistesArray[]= $newArtiste;
            }
            return $artistesArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Artiste {
        $query = $this->db->prepare("SELECT * FROM artistes WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $artiste = $query->fetch(PDO::FETCH_ASSOC);
        if ($artiste != null) {
            $newArtiste = new Artiste($artiste["artiste_name"]);
            if ($artiste["img_url"] !== null ) {
                $newArtiste->setImg_url($artiste["img_url"]);
            }
            $newArtiste->setId($artiste["ID"]);
            return $newArtiste;
        } else {
            return null;
        }
    }

    public function findByName(string $artiste_name) : ?Artiste {
        $query = $this->db->prepare("SELECT * FROM artistes WHERE artiste_name = :artiste_name");
        $parameters = [
            "artiste_name"=> $artiste_name
        ];
        $query->execute($parameters);
        $artiste = $query->fetch(PDO::FETCH_ASSOC);
        if ($artiste != null) {
            $newArtiste = new Artiste($artiste["artiste_name"]);
            if ($artiste["img_url"] !== null ) {
                $newArtiste->setImg_url($artiste["img_url"]);
            }
            $newArtiste->setId($artiste["ID"]);
            return $newArtiste;
        } else {
            return null;
        }
        
    }

    public function createArtiste(Artiste $artiste) :?Artiste {
        $query = $this->db->prepare("INSERT INTO artistes VALUE(null, :artiste_name, null)");
        $parameters = [
            "artiste_name" => $artiste->getArtiste_name()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $artiste->setId($lastId);
        return $this->findById($artiste->getId());
    }

    public function createArtiste2(Artiste $artiste) :?Artiste {
        $newArtiste = $this->findByName($artiste->getArtiste_name());
        if ($newArtiste === null) {
            $query = $this->db->prepare("INSERT INTO artistes (artiste_name, img_url) VALUES(:artiste_name, :img_url)");
            $parameters = [
                "artiste_name" => $artiste->getArtiste_name(),
                "img_url" => "https://plus.unsplash.com/premium_photo-1678216285963-253d94232eb7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            ];
            $query->execute($parameters);
            $lastId = $this->db->lastInsertId();
            $artiste->setId($lastId);
            return $this->findById($artiste->getId());
        } else {
            return $newArtiste;
        }
    }

    public function deleteArtiste(Artiste $artiste) : void {
        $query = $this->db->prepare("DELETE FROM artistes WHERE ID = :artiste_id");
        $parameters = [
            "artiste_id" => $artiste->getId()
        ];
        $query->execute($parameters);
    }

    public function editArtiste(Artiste $artiste) : ?Artiste {
        $query = $this->db->prepare("UPDATE artistes SET artiste_name = :artiste_name, img_url = :img_url WHERE ID = :artiste_id");
        $parameters = [
            "artiste_name" => $artiste->getArtiste_name(),
            "img_url" => $artiste->getImg_url(),
            "artiste_id" => $artiste->getId()
        ];
        $query->execute($parameters);
        return $this->findById($artiste->getId());
    }
}