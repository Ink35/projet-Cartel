<?php

class Date {
    private int $id;
    private string $calendarID;
    private string $timestamp;
    public function __construct(private string $date, private string $comment, private string $status, private int $capacity, private int $ticket_sold, private float $ca, private float $result_net, private City $city, private Artiste $artiste, private Place $place, private Structure $structure, private Subtype $subtype, private Type $type, private User $user, private Agent $agent, private Checklist $checklist)
    {
        
    }

    public function toArray() {
        return [
            "date_ID" => $this->id,
            "date" => $this->date,
            "comment" => $this->comment,
            "status" => $this->status,
            "capacity" => $this->capacity,
            "ticket_sold" => $this->ticket_sold,
            "ca" => $this->ca,
            "result_net" => $this->result_net,
            "calendar_ID" => $this->calendarID,
            "timestamp" => $this->timestamp,
            "city" => $this->city->toArray(),
            "artiste" => $this->artiste->toArray(),
            "place" => $this->place->toArray(),
            "structure" => $this->structure->toArray(),
            "subtype" => $this->subtype->toArray(),
            "type" => $this->type->toArray(),
            "user" => $this->user->toArray(),
            "agent" => $this->agent->toArray(),
            "checklist" => $this->checklist->toArray(),
            
        ];
    }

    /**
     * Get the value of id
     *
     * @return  mixed
     */
    public function getId() :int
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param   mixed  $id  
     *
     * @return  self
     */
    public function setId(int $id) :self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of date
     *
     * @return  mixed
     */
    public function getDate() :string
    {
        return $this->date;
    }

    /**
     * Set the value of date
     *
     * @param   mixed  $date  
     *
     * @return  self
     */
    public function setDate(string $date) :self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get the value of comment
     *
     * @return  mixed
     */
    public function getComment() :string
    {
        return $this->comment;
    }

    /**
     * Set the value of comment
     *
     * @param   mixed  $comment  
     *
     * @return  self
     */
    public function setComment(string $comment) :self
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get the value of status
     *
     * @return  mixed
     */
    public function getStatus() :string
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @param   mixed  $status  
     *
     * @return  self
     */
    public function setStatus(string $status) :self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of capacity
     *
     * @return  mixed
     */
    public function getCapacity() :int
    {
        return $this->capacity;
    }

    /**
     * Set the value of capacity
     *
     * @param   mixed  $capacity  
     *
     * @return  self
     */
    public function setCapacity(int $capacity) :self
    {
        $this->capacity = $capacity;

        return $this;
    }

    /**
     * Get the value of ca
     *
     * @return  mixed
     */
    public function getCa() :float
    {
        return $this->ca;
    }

    /**
     * Set the value of ca
     *
     * @param   mixed  $ca  
     *
     * @return  self
     */
    public function setCa(float $ca) :self
    {
        $this->ca = $ca;

        return $this;
    }

    /**
     * Get the value of result_net
     *
     * @return  mixed
     */
    public function getResult_net() :float
    {
        return $this->result_net;
    }

    /**
     * Set the value of result_net
     *
     * @param   mixed  $result_net  
     *
     * @return  self
     */
    public function setResult_net(float $result_net) :self
    {
        $this->result_net = $result_net;

        return $this;
    }

    /**
     * Get the value of city
     *
     * @return  mixed
     */
    public function getCity() :City
    {
        return $this->city;
    }

    /**
     * Set the value of city
     *
     * @param   mixed  $city  
     *
     * @return  self
     */
    public function setCity(City $city) :self
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Get the value of Artiste
     *
     * @return  mixed
     */
    public function getArtiste() :Artiste
    {
        return $this->artiste;
    }

    /**
     * Set the value of Artiste
     *
     * @param   mixed  $Artiste  
     *
     * @return  self
     */
    public function setArtiste(Artiste $artiste) :self
    {
        $this->artiste = $artiste;

        return $this;
    }

    /**
     * Get the value of place
     *
     * @return  mixed
     */
    public function getPlace() :Place
    {
        return $this->place;
    }

    /**
     * Set the value of place
     *
     * @param   mixed  $place  
     *
     * @return  self
     */
    public function setPlace(Place $place) :self
    {
        $this->place = $place;

        return $this;
    }

    /**
     * Get the value of structure
     *
     * @return  mixed
     */
    public function getStructure() :Structure
    {
        return $this->structure;
    }

    /**
     * Set the value of structure
     *
     * @param   mixed  $structure  
     *
     * @return  self
     */
    public function setStructure(Structure $structure) :self
    {
        $this->structure = $structure;

        return $this;
    }

    /**
     * Get the value of subtype
     *
     * @return  mixed
     */
    public function getSubtype() :Subtype
    {
        return $this->subtype;
    }

    /**
     * Set the value of subtype
     *
     * @param   mixed  $subtype  
     *
     * @return  self
     */
    public function setSubtype(Subtype $subtype) :self
    {
        $this->subtype = $subtype;

        return $this;
    }

    /**
     * Get the value of user
     *
     * @return  mixed
     */
    public function getUser() :User
    {
        return $this->user;
    }

    /**
     * Set the value of user
     *
     * @param   mixed  $user  
     *
     * @return  self
     */
    public function setUser(User $user) :self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get the value of type
     *
     * @return  mixed
     */
    public function getType() :Type
    {
        return $this->type;
    }

    /**
     * Set the value of type
     *
     * @param   mixed  $type  
     *
     * @return  self
     */
    public function setType(Type $type) :self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get the value of calendarID
     *
     * @return  mixed
     */
    public function getCalendarID()
    {
        return $this->calendarID;
    }

    /**
     * Set the value of calendarID
     *
     * @param   mixed  $calendarID  
     *
     * @return  self
     */
    public function setCalendarID($calendarID)
    {
        $this->calendarID = $calendarID;

        return $this;
    }

    /**
     * Get the value of timestamp
     *
     * @return  mixed
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * Set the value of timestamp
     *
     * @param   mixed  $timestamp  
     *
     * @return  self
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get the value of ticket_sold
     *
     * @return  mixed
     */
    public function getTicket_sold()
    {
        return $this->ticket_sold;
    }

    /**
     * Set the value of ticket_sold
     *
     * @param   mixed  $ticket_sold  
     *
     * @return  self
     */
    public function setTicket_sold($ticket_sold)
    {
        $this->ticket_sold = $ticket_sold;

        return $this;
    }

    /**
     * Get the value of agent
     */ 
    public function getAgent()
    {
        return $this->agent;
    }

    /**
     * Set the value of agent
     *
     * @return  self
     */ 
    public function setAgent($agent)
    {
        $this->agent = $agent;

        return $this;
    }

    /**
     * Get the value of checklist
     */ 
    public function getChecklist()
    {
        return $this->checklist;
    }

    /**
     * Set the value of checklist
     *
     * @return  self
     */ 
    public function setChecklist($checklist)
    {
        $this->checklist = $checklist;

        return $this;
    }
}