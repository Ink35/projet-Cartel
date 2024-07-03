<?php

    class Client {
        private int $id;

        public function __construct(private string $client_name) 
        {
            
        }

        public function toArray() {
            return [
                "client_ID" => $this->id,
                "client_name" => $this->client_name,
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
         * Get the value of client_name
         */ 
        public function getClient_name()
        {
                return $this->client_name;
        }

        /**
         * Set the value of client_name
         *
         * @return  self
         */ 
        public function setClient_name($client_name)
        {
                $this->client_name = $client_name;

                return $this;
        }
    }
    
