<?php 
class Subtype {
    private int $id;
    public function __construct(private string $subtype, private Type $type)
    {
        
    }

    public function toArray() {
        return [
            "subtype_ID" => $this->id,
            "subtype" => $this->subtype,
            "type" => $this->type->toArray()
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
     * Get the value of subtype
     *
     * @return  mixed
     */
    public function getSubtype() :string
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
    public function setSubtype(string $subtype) :self
    {
        $this->subtype = $subtype;

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
}