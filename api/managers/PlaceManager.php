<?php 

class PlaceManager extends AbstractManager {

   public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM places");
        $query->execute();
        $places = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($places != null) {
            $placesArray= [];
            $cm = new CityManager();
            foreach ($places as $place) {
                $city = $cm->findById($place["city_ID"]);
                $newPlace = new Place($place["place_name"], $city);
                $newPlace->setId($place["ID"]);
                $placesArray[]= $newPlace;
            }
            return $placesArray;
        } else {
            return null;
        }
    }

    public function findAllPlaceByCity(City $city) :?array {
        $query = $this->db->prepare("SELECT * FROM places WHERE city_ID = :city_ID");
        $parameters = [
            "city_ID" => $city->getId()
        ];
        $query->execute($parameters);
        $places=$query->fetchAll(PDO::FETCH_ASSOC);
        if ($places != null) {
            $placesArray= [];
            $cm = new CityManager();
            foreach ($places as $place) {
                $city = $cm->findById($place["city_ID"]);
                $newPlace = new Place($place["place_name"], $city);
                $newPlace->setId($place["ID"]);
                $placesArray[]= $newPlace;
            }
            return $placesArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Place {
        $query = $this->db->prepare("SELECT * FROM places WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $place = $query->fetch(PDO::FETCH_ASSOC);
        if ($place != null) {
            $cm = new CityManager();
            $city = $cm->findById($place["city_ID"]);
            $newPlace = new Place($place["place_name"], $city);
            $newPlace->setId($place["ID"]);
            return $newPlace;
        } else {
            return null;
        }
    }

    public function findbyName(string $place_name) :?Place {
        $query = $this->db->prepare("SELECT * FROM places WHERE place_name = :place_name");
        $parameters = [
            "place_name" => $place_name
        ];
        $query->execute($parameters);
        $place = $query->fetch(PDO::FETCH_ASSOC);
        if ($place != null) {
            $cm = new CityManager;
            $city = $cm->findById($place["city_ID"]);
            $newPlace = new Place($place["place_name"], $city);
            $newPlace->setId($place["ID"]);
            return $newPlace;
        } else {
            return null;
        }
    }

    public function findbyNameWithCityId(Place $place) :?Place {
        $query = $this->db->prepare("SELECT * FROM places WHERE place_name = :place_name AND city_ID = :city_ID");
        $parameters = [
            "place_name" => $place->getPlace_name(),
            "city_ID" => $place->getCity()->getId()
        ];
        $query->execute($parameters);
        $place = $query->fetch(PDO::FETCH_ASSOC);
        if ($place != null) {
            $cm = new CityManager;
            $city = $cm->findById($place["city_ID"]);
            $newPlace = new Place($place["place_name"], $city);
            $newPlace->setId($place["ID"]);
            return $newPlace;
        } else {
            return null;
        }
    }

    public function createPlace(Place $place) :?Place {
        $query = $this->db->prepare("INSERT INTO places VALUE(null,:city_ID, :place_name)");
        $parameters = [
            "city_ID" => $place->getCity()->getId(),
            "place_name" => $place->getplace_name()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $place->setId($lastId);
        return $this->findById($place->getId());
    }

    public function createPlace2(Place $place) :?Place {
        $newPlace = $this->findbyNameWithCityId($place);
        if ($newPlace === null) {
            $query = $this->db->prepare("INSERT INTO places VALUE(null,:city_ID, :place_name)");
            $parameters = [
                "city_ID" => $place->getCity()->getId(),
                "place_name" => $place->getPlace_name()
            ];
            $query->execute($parameters);
            $lastId = $this->db->lastInsertId();
            $place->setId($lastId);
            return $this->findById($place->getId());
    } else {
        return $newPlace;
    }
    }

    public function deletePlace(Place $place) : void {
        $query = $this->db->prepare("DELETE FROM places WHERE ID = :place_id");
        $parameters = [
            "place_id" => $place->getId()
        ];
        $query->execute($parameters);
    }

    public function editPlace(Place $place) :?Place {
        $query = $this->db->prepare("UPDATE places SET city_ID = :city_ID, place_name = :place_name WHERE ID = :place_ID");
        $parameters = [
            "city_ID"=> $place->getCity()->getId(),
            "place_name"=> $place->getPlace_name(),
            "place_ID" => $place->getId()
        ];
        $query->execute($parameters);
        return $this->findById($place->getId());
    }
}