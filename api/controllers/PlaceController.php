<?php

class PlaceController extends AbstractController {

    private PlaceManager $pm;
    private CityManager $cm;

    public function __construct()
    {
        $this->pm = new PlaceManager();
        $this->cm = new CityManager();
    }

    public function findAll() {
        $places = $this->pm->findAll();
        if ($places != null) {
            $placesArray = [];
            foreach ($places as $place) {
                $newPlace = $place->toArray();
                $placesArray[] = $newPlace;
            }
            $this->render(["places"=> $placesArray]);
        }
    }

    public function createPlace(array $post) {
        $place = $this->pm->findByName(htmlspecialchars($post["place_name"]));
        if ($place === null) {
            $city = $this->cm->findById($post["city_ID"]);
            $place = new Place(htmlspecialchars($post["place_name"]), $city);
            $newPlace = $this->pm->createPlace($place);
            $this->render(["success"=> true, "newPlace" => $newPlace->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "place déja dans la BDD" ]);
        }
    }

    public function updatePlace(array $post) {
        $place = $this->pm->findById($post["place_ID"]);
        if ($place !== null) {
            $place->setPlace_name(htmlspecialchars($post["place_name"]));
            $newPlace = $this->pm->editPlace($place);
            $this->render(["success" => true, "editedPlace"=> $newPlace->toArray()]);
        }

    }

    public function deletePlace(array $post) {
        $place = $this->pm->findById($post["place_ID"]);
        if ($place !== null) {
            $this->pm->deletePlace($place);
        }
    }
}