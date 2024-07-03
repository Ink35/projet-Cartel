<?php

class Structure {
    private int $id;
    public function __construct(private string $structure_name)
    {
        
    }

    public function toArray() {
        return [
            "structure_ID" => $this->id,
            "structure_name" => $this->structure_name
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
     * Get the value of structure_name
     *
     * @return  mixed
     */
    public function getStructure_name() :string
    {
        return $this->structure_name;
    }

    /**
     * Set the value of structure_name
     *
     * @param   mixed  $structure_name  
     *
     * @return  self
     */
    public function setStructure_name(string $structure_name) :self
    {
        $this->structure_name = $structure_name;

        return $this;
    }
}