<?php
class Agent {
    private int $id;
    public function __construct(private string $agent_name)
    {
        
    }

    public function toArray() {
        return [
            "agent_ID" => $this->id,
            "agent_name" => $this->agent_name
        ];
    }

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of agent_name
     */ 
    public function getAgent_name()
    {
        return $this->agent_name;
    }

    /**
     * Set the value of agent_name
     *
     * @return  self
     */ 
    public function setAgent_name($agent_name)
    {
        $this->agent_name = $agent_name;

        return $this;
    }
}