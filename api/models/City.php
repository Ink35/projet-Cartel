<?php

class City {
    private int $id;
    public function __construct(private string $city_name)
    {
        
    }
    public function toArray() {
        return [
            "city_ID" => $this->id,
            "city_name" => $this->city_name
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
     * Get the value of city_name
     *
     * @return  mixed
     */
    public function getCity_name() :string
    {
        return $this->city_name;
    }

    /**
     * Set the value of city_name
     *
     * @param   mixed  $city_name  
     *
     * @return  self
     */
    public function setCity_name(string $city_name) :self
    {
        $this->city_name = $city_name;

        return $this;
    }
}