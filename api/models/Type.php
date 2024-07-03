<?php
class Type {
    private int $id;
    public function __construct(private string $type)
    {
        
    }

    public function toArray() {
        return [
            "type_ID" => $this->id,
            "type" => $this->type
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
     * Get the value of type
     *
     * @return  mixed
     */
    public function getType() :string
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
    public function setType(string $type) :self
    {
        $this->type = $type;

        return $this;
    }
}