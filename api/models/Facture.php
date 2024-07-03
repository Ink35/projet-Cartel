<?php

class Facture {
    private int $id;
    private ?Date $date;
    private ?Artiste $artiste;
    public function __construct(private Client $client, private string $facture_number, private string $facture_link, private string $acompte_status, private string $date_relance, private string $commentary, private string $archive_status)
    {
        $this->date = null; // Initialiser $date comme null
        $this->artiste = null; // Initialiser $artiste comme null
    }

    public function toArray() {
        $returnArray = [
            "facture_ID" => $this->id,
            "client" => $this->client->toArray(),
            "facture_number" => $this->facture_number,
            "facture_link" => $this->facture_link,
            "acompte_status" => $this->acompte_status,
            "date_relance" => $this->date_relance,
            "commentary" => $this->commentary,
            "archive_status" => $this->archive_status,
        ];
        if (isset($this->date)) { // Vérifie si $date est initialisée
            $returnArray["date"] = $this->date->toArray();
        }
        if ($this->artiste !== null) {
            $returnArray["artiste"] = $this->artiste->toArray();
        }
        return $returnArray;

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
     * Get the value of date
     */ 
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set the value of date
     *
     * @return  self
     */ 
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get the value of artiste
     */ 
    public function getArtiste()
    {
        return $this->artiste;
    }

    /**
     * Set the value of artiste
     *
     * @return  self
     */ 
    public function setArtiste($artiste)
    {
        $this->artiste = $artiste;

        return $this;
    }

    /**
     * Get the value of client
     */ 
    public function getClient()
    {
        return $this->client;
    }

    /**
     * Set the value of client
     *
     * @return  self
     */ 
    public function setClient($client)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get the value of facture_number
     */ 
    public function getFacture_number()
    {
        return $this->facture_number;
    }

    /**
     * Set the value of facture_number
     *
     * @return  self
     */ 
    public function setFacture_number($facture_number)
    {
        $this->facture_number = $facture_number;

        return $this;
    }

    /**
     * Get the value of facture_link
     */ 
    public function getFacture_link()
    {
        return $this->facture_link;
    }

    /**
     * Set the value of facture_link
     *
     * @return  self
     */ 
    public function setFacture_link($facture_link)
    {
        $this->facture_link = $facture_link;

        return $this;
    }

    /**
     * Get the value of acompte_status
     */ 
    public function getAcompte_status()
    {
        return $this->acompte_status;
    }

    /**
     * Set the value of acompte_status
     *
     * @return  self
     */ 
    public function setAcompte_status($acompte_status)
    {
        $this->acompte_status = $acompte_status;

        return $this;
    }

    /**
     * Get the value of date_relance
     */ 
    public function getDate_relance()
    {
        return $this->date_relance;
    }

    /**
     * Set the value of date_relance
     *
     * @return  self
     */ 
    public function setDate_relance($date_relance)
    {
        $this->date_relance = $date_relance;

        return $this;
    }

    /**
     * Get the value of commentary
     */ 
    public function getCommentary()
    {
        return $this->commentary;
    }

    /**
     * Set the value of commentary
     *
     * @return  self
     */ 
    public function setCommentary($commentary)
    {
        $this->commentary = $commentary;

        return $this;
    }

    /**
     * Get the value of archive_status
     */ 
    public function getArchive_status()
    {
        return $this->archive_status;
    }

    /**
     * Set the value of archive_status
     *
     * @return  self
     */ 
    public function setArchive_status($archive_status)
    {
        $this->archive_status = $archive_status;

        return $this;
    }
}