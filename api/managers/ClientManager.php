<?php 

class ClientManager extends AbstractManager {
    
    public function findAll() {
        $query = $this->db->prepare("SELECT * FROM client");
        $query->execute();
        $clients = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($clients !== null) {
            $clientsArray = [];
            foreach($clients as $client) {
                $newClient = new Client($client["client_name"]);
                $newClient->setId($client["client_ID"]);
                $clientsArray[] = $newClient;
            }
            return $clientsArray;
        }
    }

    public function findById(int $id) {
        $query = $this->db->prepare("SELECT * FROM client WHERE client_ID = :client_ID");
        $parameters = [
            "client_ID" => $id
        ];
        $query->execute($parameters);
        $client = $query->fetch(PDO::FETCH_ASSOC);
        if ($client !== null) {
            $newClient = new Client($client["client_name"]);
            $newClient->setId($client["client_ID"]);
            return $newClient;
        }
    }

    public function findByName(Client $client) {
        $query = $this->db->prepare("SELECT * FROM client WHERE client_name = :client_name");
        $parameters = [
            "client_name" => $client->getClient_name()
        ];
        $query->execute($parameters);
        $client = $query->fetch(PDO::FETCH_ASSOC);
        if ($client != null) {
            $newClient = new Client($client["client_name"]);
            $newClient->setId($client["client_ID"]);
            return $newClient;
        } else { 
            return null;
        }
    }

    public function createClient(Client $client) {
        $newClient = $this->findByName($client);
        if ($newClient === null) {
            $query = $this->db->prepare("INSERT INTO client (client_name) VALUE (:client_name)");
            $parameters = [
                "client_name" => $client->getClient_name(),
            ];
            $query->execute($parameters);
            $lastID = $this->db->lastInsertId();
            return $this->findById($lastID);
        } else {
            return $newClient;
        }
        
    }

    public function editClient(Client $client) {
        $query = $this->db->prepare("UPDATE client SET client_name = :client_name WHERE client_ID = :client_ID");
        $parameters = [
            "client_name" => $client->getClient_name(),
            "client_ID" => $client->getId(),
        ];
        $query->execute($parameters);
        return $this->findById($client->getId());
    }

    public function deleteClient(Client $client) {
        $query = $this->db->prepare("DELETE FROM client WHERE client_ID = :client_ID");
        $parameters = [
            "client_ID" => $client->getId(),
        ];
        $query->execute($parameters);
    }
}