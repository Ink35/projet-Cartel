<?php 

class DateManager extends AbstractManager {

    private ArtisteManager $am;
    private CityManager $cm;
    private PlaceManager $pm;
    private StructureManager $sm;
    private SubtypeManager $stm;
    private TypeManager $tm;
    private UserManager $um;
    private AgentManager $agm;
    private ChecklistManager $clm;

    public function __construct() {
        parent::__construct();
        $this->am = new ArtisteManager();
        $this->cm = new CityManager();
        $this->pm = new PlaceManager();
        $this->sm = new StructureManager();
        $this->stm = new SubtypeManager();
        $this->tm = new TypeManager();
        $this->um = new UserManager();
        $this->agm = new AgentManager();
        $this->clm = new ChecklistManager();
    }

    public function findAll() {
        $query = $this->db->prepare("SELECT * FROM dates");
        $query->execute();
        $dates = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($dates != null) {
            $datesArray = [];
            foreach ($dates as $date) {
                $artiste = $this->am->findById($date["artiste_ID"]);
                $city = $this->cm->findById($date["city_ID"]);
                $place = $this->pm->findById($date["place_ID"]);
                $structure = $this->sm->findById($date["structure_ID"]);
                $subtype = $this->stm->findById($date["subtype_ID"]);
                $type = $this->tm->findById($date["type_ID"]);
                $user = $this->um->findById($date["user_ID"]);
                $agent = $this->agm->findById($date["agent_ID"]);
                $checklist = $this->clm->findById($date["checklist_ID"]);
                $newDate = new Date($date["date"], $date["comment"], $date["status"], $date["capacity"], $date["ticket_sold"], $date["ca"], $date["result_net"], $city, $artiste, $place, $structure, $subtype, $type, $user, $agent, $checklist);
                $newDate->setId($date["ID"]);
                $newDate->setCalendarID($date["calendar_ID"]);
                $newDate->setTimestamp($date["timestamp_column"]);
                $datesArray[] = $newDate;
            } 
            return $datesArray;
        } else {
            return null;
        }   
    }

    public function findById(int $id) :?Date {
        $query = $this->db->prepare("SELECT * FROM dates WHERE ID = :date_id");
        $parameters = [
            "date_id"=> $id
        ];
        $query->execute($parameters);
        $date = $query->fetch(PDO::FETCH_ASSOC);
        if ($date != null) {
            $artiste = $this->am->findById($date["artiste_ID"]);
            $city = $this->cm->findById($date["city_ID"]);
            $place = $this->pm->findById($date["place_ID"]);
            $structure = $this->sm->findById($date["structure_ID"]);
            $subtype = $this->stm->findById($date["subtype_ID"]);
            $type = $this->tm->findById($date["type_ID"]);
            $user = $this->um->findById($date["user_ID"]);
            $agent = $this->agm->findById($date["agent_ID"]);
            $checklist = $this->clm->findById($date["checklist_ID"]);
            $newDate = new Date($date["date"], $date["comment"], $date["status"], $date["capacity"], $date["ticket_sold"], $date["ca"], $date["result_net"], $city, $artiste, $place, $structure, $subtype, $type, $user, $agent, $checklist);
            $newDate->setId($date["ID"]);
            $newDate->setCalendarID($date["calendar_ID"]);
            $newDate->setTimestamp($date["timestamp_column"]);
            return $newDate;
        } else {
            return null;
        }
    }

    public function findByChecklistId(int $id) : ?Date {
        $query = $this->db->prepare("SELECT * FROM dates WHERE checklist_ID = :checklist_ID");
        $parameters = [
            "checklist_ID"=> $id
        ];
        $query->execute($parameters);
        $date = $query->fetch(PDO::FETCH_ASSOC);
        if ($date != null) {
            $artiste = $this->am->findById($date["artiste_ID"]);
            $city = $this->cm->findById($date["city_ID"]);
            $place = $this->pm->findById($date["place_ID"]);
            $structure = $this->sm->findById($date["structure_ID"]);
            $subtype = $this->stm->findById($date["subtype_ID"]);
            $type = $this->tm->findById($date["type_ID"]);
            $user = $this->um->findById($date["user_ID"]);
            $agent = $this->agm->findById($date["agent_ID"]);
            $checklist = $this->clm->findById($date["checklist_ID"]);
            $newDate = new Date($date["date"], $date["comment"], $date["status"], $date["capacity"], $date["ticket_sold"], $date["ca"], $date["result_net"], $city, $artiste, $place, $structure, $subtype, $type, $user, $agent, $checklist);
            $newDate->setId($date["ID"]);
            $newDate->setCalendarID($date["calendar_ID"]);
            $newDate->setTimestamp($date["timestamp_column"]);
            return $newDate;
        } else {
            return null;
        }
    }

    public function createDate(Date $date) :?Date {
        $query = $this->db->prepare("INSERT INTO dates (date, comment, status, capacity, ticket_sold, ca, result_net, city_ID, artiste_ID, place_ID, structure_ID, subtype_ID, type_ID, user_ID, calendar_ID, agent_ID, checklist_ID) 
                             VALUES (:date, :comment, :status, :capacity, :ticket_sold, :ca, :result_net, :city_ID, :artiste_ID, :place_ID, :structure_ID, :subtype_ID, :type_ID, :user_ID, :calendar_ID, :agent_ID, :checklist_ID)");
        $parameters = [
            "date" => $date->getDate(),
            "comment" => $date->getComment(),
            "status" => $date->getStatus(),
            "capacity" => $date->getCapacity(),
            "ticket_sold" => $date->getTicket_sold(),
            "ca" => $date->getCa(),
            "result_net" => $date->getResult_net(),
            "city_ID" => $date->getCity()->getId(),
            "artiste_ID" => $date->getArtiste()->getId(),
            "place_ID" => $date->getPlace()->getId(),
            "structure_ID" => $date->getStructure()->getId(),
            "subtype_ID" => $date->getSubtype()->getId(),
            "type_ID" => $date->getType()->getId(),
            "user_ID" => $date->getUser()->getId(),
            "calendar_ID" => $date->getCalendarID(),
            "agent_ID"=> $date->getAgent()->getId(),
            "checklist_ID" => $date->getChecklist()->getId(),
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        return $this->findById($lastId);
    }

    public function deleteDate(Date $date) :void {
        $query = $this->db->prepare('DELETE FROM dates WHERE ID = :date_id');
        $parameters = [
            "date_id" => $date->getId()
        ];
        $query->execute($parameters);
    }

    public function editDate(Date $date) : ?Date {
        $query = $this->db->prepare("UPDATE dates SET date = :date, comment = :comment, status = :status, capacity = :capacity, ticket_sold = :ticket_sold, ca = :ca, result_net = :result_net, city_ID = :city_ID, artiste_ID = :artiste_ID, place_ID = :place_ID, structure_ID = :structure_ID, subtype_ID = :subtype_ID, type_ID = :type_ID, user_ID = :user_ID, calendar_ID = :calendar_ID, agent_ID = :agent_ID, checklist_ID = :checklist_ID WHERE ID = :date_ID");
        $parameters = [
            "date" => $date->getDate(),
            "comment" => $date->getComment(),
            "status" => $date->getStatus(),
            "capacity" => $date->getCapacity(),
            "ticket_sold" => $date->getTicket_sold(),
            "ca" => $date->getCa(),
            "result_net" => $date->getResult_net(),
            "city_ID" => $date->getCity()->getId(),
            "artiste_ID" => $date->getArtiste()->getId(),
            "place_ID" => $date->getPlace()->getId(),
            "structure_ID" => $date->getStructure()->getId(),
            "subtype_ID" => $date->getSubtype()->getId(),
            "type_ID" => $date->getType()->getId(),
            "user_ID" => $date->getUser()->getId(),
            "calendar_ID" => $date->getCalendarID(),
            "agent_ID" => $date->getAgent()->getId(),
            "checklist_ID" => $date->getChecklist()->getId(),
            "date_ID" => $date->getId(),
        ];
        $query->execute($parameters);
        return $this->findById($date->getId());
    }
}