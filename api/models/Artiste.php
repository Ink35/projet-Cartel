<?php

class Artiste {
    private int $id;
    private string $img_url = "";
    public function __construct(private string $artiste_name)
    {
        
    }

    public function toArray() {
        $artisteArray = [
            "artiste_ID" => $this->id,
            "artiste_name" => $this->artiste_name
        ];
        if ($this->img_url !== null) {
            $artisteArray["img_url"] = $this->img_url;
        }
        return $artisteArray;
    }

    /**
     * Get the value of id
     *
     * @return  mixed
     */
    public function getId() : int
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
    public function setId(int $id) : self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of artiste_name
     *
     * @return  mixed
     */
    public function getArtiste_name() :string
    {
        return $this->artiste_name;
    }

    /**
     * Set the value of artiste_name
     *
     * @param   mixed  $artiste_name  
     *
     * @return  self
     */
    public function setArtiste_name(string $artiste_name) :self
    {
        $this->artiste_name = $artiste_name;

        return $this;
    }

    /**
     * Get the value of img_url
     *
     * @return  mixed
     */
    public function getImg_url()
    {
        return $this->img_url;
    }

    /**
     * Set the value of img_url
     *
     * @param   mixed  $img_url  
     *
     * @return  self
     */
    public function setImg_url($img_url)
    {
        $this->img_url = $img_url;

        return $this;
    }
}