<?php

class CityController extends AbstractController {

    private CityManager $cm;
    private PlaceManager $pm;

    public function __construct()
    {
        $this->cm = new CityManager();
        $this->pm = new PlaceManager();
    }

    public function findAll() {
        $cities = $this->cm->findAll();
        if ($cities != null) {
            $citiesArray = [];
            foreach ($cities as $city) {
                $newCity = $city->toArray();
                $citiesArray[] = $newCity;
            }
            $this->render(["cities"=> $citiesArray]);
        }
    }

    public function createCity(array $post) {
        $city = $this->cm->findByName(htmlspecialchars($post["city_name"]));
        if ($city === null) {
            $city = new City(htmlspecialchars($post["city_name"]));
            $newCity = $this->cm->createCity($city);
            $this->render(["success"=> true, "newCity" => $newCity->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "city déja dans la BDD" ]);
        }

        
    }

    public function updateCity(array $post) {
        $city = $this->cm->findById($post["city_ID"]);
        if ($city !== null) {
            $city->setCity_name(htmlspecialchars($post["city_name"]));
            $newCity = $this->cm->editCity($city);
            $this->render(["success" => true, "editedCity"=> $newCity->toArray()]);
        }

    }

    public function deleteCity(array $post) {
        $city = $this->cm->findById($post["city_ID"]);
        if ($city !== null) {
            $places = $this->pm->findAllPlaceByCity($city);
            foreach ($places as $place) {
                $this->pm->deletePlace($place);
            }
            $this->cm->deleteCity($city);
        }
    }
}