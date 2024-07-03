<?php

class DateController extends AbstractController {
    private DateManager $dm;
    private ArtisteManager $am;
    private CityManager $cm;
    private PlaceManager $pm;
    private StructureManager $sm;
    private SubtypeManager $stm;
    private TypeManager $tm;
    private UserManager $um;
    private GoogleCalendarService $cal;
    private AgentManager $agm;
    private ChecklistManager $clm;

    public function __construct() 
    {
        $this->dm = new DateManager;
        $this->am = new ArtisteManager();
        $this->cm = new CityManager();
        $this->pm = new PlaceManager();
        $this->sm = new StructureManager();
        $this->stm = new SubtypeManager();
        $this->tm = new TypeManager();
        $this->um = new UserManager();
        $this->cal = new GoogleCalendarService();
        $this->agm = new AgentManager();
        $this->clm = new ChecklistManager();
    }

    public function findAll() {
        $dates = $this->dm->findAll();
        if ($dates != null) {
            $datesArray = [];
            foreach($dates as $date) {
                $newDate = $date->toArray();
                $datesArray[]=$newDate;
            }
            $this->render(["dates"=> $datesArray]);
        }
    }

    public function createDateUpdate(array $post) {
        $city = new City($post["city_name"]);
        $cityChecked = $this->cm->createCity2($city);
        $artiste = new Artiste($post["artiste_name"]);
        $artisteChecked = $this->am->createArtiste2($artiste);
        $place = new Place($post["place_name"], $cityChecked);
        $placeChecked = $this->pm->createPlace2($place);
        $agent = new Agent($post["agent_name"]);
        $agentChecked = $this->agm->createAgent($agent);
        $checklist = new Checklist($post["in_sale"]);
        $newChecklist = $this->clm->createChecklist($checklist);
        $structure = $this->sm->findById($post["structure_ID"]);
        $subtype = $this->stm->findById($post["subtype_ID"]);
        $type = $this->tm->findById($post["type_ID"]);
        $user = $this->um->findById($post["user_ID"]);
        $date = new Date(
            htmlspecialchars($post["date"]),
            htmlspecialchars($post["comment"]),
            htmlspecialchars($post["status"]),
            htmlspecialchars($post["capacity"]),
            htmlspecialchars($post["ticket_sold"]),
            htmlspecialchars($post["ca"]),
            htmlspecialchars($post["result_net"]),
            $cityChecked,
            $artisteChecked,
            $placeChecked,
            $structure,
            $subtype,
            $type,
            $user,
            $agentChecked,
            $checklist,
        );
        $date = $this->addToCalendar($date);
        $newDate = $this->dm->createDate($date);
        $this->render(["sucess"=> true, "newDate"=> $newDate->toArray(), "event_id"=>$newDate->getCalendarID()]);
    }

    public function editDate(array $post) {
        $date = $this->dm->findById($post["date_ID"]);
        if ($date !== null) {
            $oldStatus = $date->getStatus();
            $oldDate = $date->getDate();
            $oldType = $date->getType()->getType();
            $oldCity = $date->getCity()->getCity_name();
            $oldPlace = $date->getPlace()->getPlace_name();
            $city = new City($post["city_name"]);
            $cityChecked = $this->cm->createCity2($city);
            $artiste = $this->am->findById($post["artiste_ID"]);
            $place = new Place($post["place_name"], $cityChecked);
            $placeChecked = $this->pm->createPlace2($place);
            $agent = new Agent($post["agent_name"]);
            $agentChecked = $this->agm->createAgent($agent);
            $structure = $this->sm->findById($post["structure_ID"]);
            $subtype = $this->stm->findById($post["subtype_ID"]);
            $type = $this->tm->findById($post["type_ID"]);
            $user = $this->um->findById($post["user_ID"]);
            $checklist = $this->clm->findById($post["checklist_ID"]);
            $date->setDate($post["date"]);
            $date->setComment($post["comment"]);
            $date->setStatus($post["status"]);
            $date->setCapacity($post["capacity"]);
            $date->setTicket_sold($post["ticket_sold"]);
            $date->setCa($post["ca"]);
            $date->setResult_net($post["result_net"]);
            $date->setCity($cityChecked);
            $date->setArtiste($artiste);
            $date->setPlace($placeChecked);
            $date->setStructure($structure);
            $date->setSubtype($subtype);
            $date->setType($type);
            $date->setUser($user);
            $date->setAgent($agentChecked);
            $date->setChecklist($checklist);
            $date->setCalendarID($post["calendar_ID"]);
            
            if ($oldStatus !== $date->getStatus() 
                || $oldType !== $date->getType()->getType() 
                || $oldCity !== $date->getCity()->getCity_name()
                || $oldPlace !== $date->getPlace()->getPlace_name()
                || $oldDate !== $date->getDate()
            ) {
                if ($oldStatus !== $date->getStatus() && $date->getStatus() === "option") {
                    $this->deleteInCalendar($date, $oldStatus, $oldType);
                    $date = $this->addToCalendar($date);
                } else if ($oldStatus !== $date->getStatus() && $oldType === $date->getType()->getType() && $oldStatus !== "option") {
                    $this->updateToCalendar($date);
                } else if ($oldType !== $date->getType()->getType() && $date->getStatus() !== "option") {
                    $this->deleteInCalendar($date, $oldStatus, $oldType);
                    $date = $this->addToCalendar($date);
                } else if ($oldStatus === "option" && $oldStatus !== $date->getStatus()) {
                    $this->deleteInCalendar($date, $oldStatus, $oldType);
                    $date = $this->addToCalendar($date);
                } else {
                    $this->updateToCalendar($date);
                } 
            }
            
            $newDate = $this->dm->editDate($date);
            $this->render(["success" => true, "editedDate"=> $newDate->toArray()]);
        } else {
            $this->render(["errorMessage" => "Probleme dans L'ID ?"]);
        }
    }
    

    public function addToCalendar($date) {
        $title = $date->getArtiste()->getArtiste_name();
        $calendarURL = "";
        if ($date->getStatus() === "canceled") {
            $title .= " (annulé)";
        }
        if ($date->getStatus() === "option") {
            $calendarURL = "e6bf92a8087f2fe999193a72232cf3f7cb684c42932c9ed3d3ce11e031e162a3@group.calendar.google.com";
        } else if ($date->getType()->getType() === "vente") {
            $calendarURL = "7b9d90d0923681d9b6f06635cc6cedf9d285d43e3ed034c1fb8f771e885e135a@group.calendar.google.com";
        } else {
            $calendarURL = "83108cdc65e36efc1afab67a9a2171c50433ac7b9604139bd9233d7e242aef67@group.calendar.google.com";
        }
        $date->setCalendarID($this->cal->createEvent(
            $calendarURL,
            $title,
            $date->getDate(),
            $date->getDate(),
            $date->getPlace()->getPlace_name(),
            $date->getCity()->getCity_name()
            )); 
        return $date;
    }

    public function updateToCalendar($date) {
        $title = $date->getArtiste()->getArtiste_name();
        $calendarURL = "";
        if ($date->getStatus() === "canceled") {
            $title .= " (annulé)";
        }
        if ($date->getStatus() === "option") {
            $calendarURL = "e6bf92a8087f2fe999193a72232cf3f7cb684c42932c9ed3d3ce11e031e162a3@group.calendar.google.com";
        } else if ($date->getType()->getType() === "vente") {
            $calendarURL = "7b9d90d0923681d9b6f06635cc6cedf9d285d43e3ed034c1fb8f771e885e135a@group.calendar.google.com";
        } else {
            $calendarURL = "83108cdc65e36efc1afab67a9a2171c50433ac7b9604139bd9233d7e242aef67@group.calendar.google.com";
        }
        $this->cal->updateEvent(
        $calendarURL,
        $date->getCalendarID(), 
        $title,
        $date->getDate(),
        $date->getDate(),
        $date->getPlace()->getPlace_name(),
        $date->getCity()->getCity_name());
    }

    public function deleteInCalendar($date, $oldStatus, $oldType) {
        if ($oldStatus === "option") {
            $this->cal->deleteEvent("e6bf92a8087f2fe999193a72232cf3f7cb684c42932c9ed3d3ce11e031e162a3@group.calendar.google.com", $date->getCalendarID());
        } else if ($oldType === "vente"){
            
            $this->cal->deleteEvent("7b9d90d0923681d9b6f06635cc6cedf9d285d43e3ed034c1fb8f771e885e135a@group.calendar.google.com", $date->getCalendarID());
        } else {
            $this->cal->deleteEvent("83108cdc65e36efc1afab67a9a2171c50433ac7b9604139bd9233d7e242aef67@group.calendar.google.com", $date->getCalendarID());
        }
    }

    public function deleteDate(array $post) {
        $date = $this->dm->findById($post["date_ID"]);
        
    
        if ($date === null) {
            // La date n'existe pas dans la base de données, rien à supprimer
            $this->render(["success" => false, "error" => "La date n'existe pas"]);
            return;
        }
        if ($date->getCalendarID() !== "") {
            if ($date->getStatus() === "option") {
                $this->cal->deleteEvent("e6bf92a8087f2fe999193a72232cf3f7cb684c42932c9ed3d3ce11e031e162a3@group.calendar.google.com", $date->getCalendarID());
            } else if ($date->getType()->getType() === "vente"){
                
                $this->cal->deleteEvent("7b9d90d0923681d9b6f06635cc6cedf9d285d43e3ed034c1fb8f771e885e135a@group.calendar.google.com", $date->getCalendarID());
            } else {
                $this->cal->deleteEvent("83108cdc65e36efc1afab67a9a2171c50433ac7b9604139bd9233d7e242aef67@group.calendar.google.com", $date->getCalendarID());
            }
        }
        $this->dm->deleteDate($date);
        $this->render(["success" => true, "deleteDate" => "La date a été supprimée avec succès"]);
    }
    
}