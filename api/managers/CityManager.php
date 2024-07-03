<?php 
class CityManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM cities");
        $query->execute();
        $cities = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($cities != null) {
            $citiesArray= [];
            foreach ($cities as $city) {
                $newCity = new City($city["city_name"]);
                $newCity->setId($city["ID"]);
                $citiesArray[]= $newCity;
            }
            return $citiesArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?City {
        $query = $this->db->prepare("SELECT * FROM cities WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $city = $query->fetch(PDO::FETCH_ASSOC);
        if ($city != null) {
            $newCity = new City($city["city_name"]);
            $newCity->setId($city["ID"]);
            return $newCity;
        } else {
            return null;
        }
    }

    public function findByName(string $city_name) : ?City {
        $query = $this->db->prepare("SELECT * FROM cities WHERE city_name = :city_name");
        $parameters = [
            "city_name"=> $city_name
        ];
        $query->execute($parameters);
        $city = $query->fetch(PDO::FETCH_ASSOC);
        if ($city != null) {
            $newCity = new City($city["city_name"]);
            $newCity->setId($city["ID"]);
            return $newCity;
        } else {
            return null;
        }
        
    }


    public function createCity(City $city) :?City {
        $query = $this->db->prepare("INSERT INTO cities VALUE(null, :city_name)");
        $parameters = [
            "city_name" => $city->getCity_name()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $city->setId($lastId);
        return $this->findById($city->getId());
    }

    public function createCity2(City $city) :?City {
        $newCity = $this->findByName($city->getCity_name());
        if ($newCity === null) {
            $query = $this->db->prepare("INSERT INTO cities VALUE(null, :city_name)");
            $parameters = [
                "city_name" => $city->getCity_name()
            ];
            $query->execute($parameters);
            $lastId = $this->db->lastInsertId();
            $city->setId($lastId);
            return $this->findById($city->getId());
        } else {
            return $newCity;
        }
    }

    public function deleteCity(City $city) : void {
        $query = $this->db->prepare("DELETE FROM cities WHERE ID = :city_id");
        $parameters = [
            "city_id" => $city->getId()
        ];
        $query->execute($parameters);
    }

    public function editCity(City $city) :?City {
        $query = $this->db->prepare("UPDATE cities SET city_name = :city_name WHERE ID = :city_ID");
        $parameters = [
            "city_name"=> $city->getCity_name(),
            "city_ID"=> $city->getId()
        ];
        $query->execute($parameters);
        return $this->findById($city->getId());
    }
}