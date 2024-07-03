<?php 

class Place {
    private int $id;
    public function __construct(private string $place_name, private City $city)
    {
        
    }
    
    public function toArray() {
        return [
            "place_ID" => $this->id,
            "place_name" => $this->place_name,
            "city" => $this->city->toArray()
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
     * Get the value of place_name
     *
     * @return  mixed
     */
    public function getPlace_name() :string
    {
        return $this->place_name;
    }

    /**
     * Set the value of place_name
     *
     * @param   mixed  $place_name  
     *
     * @return  self
     */
    public function setPlace_name(string $place_name) :self
    {
        $this->place_name = $place_name;

        return $this;
    }

    /**
     * Get the value of city_id
     *
     * @return  mixed
     */
    public function getCity() :City
    {
        return $this->city;
    }

    /**
     * Set the value of city_id
     *
     * @param   mixed  $city_id  
     *
     * @return  self
     */
    public function setCity(City $city) :self
    {
        $this->city = $city;

        return $this;
    }
}