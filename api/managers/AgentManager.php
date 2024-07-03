<?php 

class AgentManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM agents");
        $query->execute();
        $agents = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($agents != null) {
            $agentsArray =[];
            foreach($agents as $agent) {
                $newAgent = new Agent($agent["agent_name"]);
                $newAgent->setId($agent["agent_ID"]);
                $agentsArray[]= $newAgent;
            } 
            return $agentsArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Agent {
        $query = $this->db->prepare("SELECT * FROM agents WHERE agent_ID = :agent_ID");
        $parameters = [
            "agent_ID"=>$id,
        ];
        $query->execute($parameters);
        $agent = $query->fetch(PDO::FETCH_ASSOC);
        if ($agent != null) {
            $newAgent = new Agent($agent["agent_name"]);
            $newAgent->setId($agent["agent_ID"]);
            return $newAgent;
        } else {
            return null;
        }
    }

    public function findByName(string $agent_name) : ?Agent {
        $query = $this->db->prepare("SELECT * FROM agents WHERE agent_name = :agent_name");
        $parameters = [
            "agent_name" => $agent_name,
        ];
        $query->execute($parameters);
        $agent = $query->fetch(PDO::FETCH_ASSOC);
        if ($agent != null ) {
            $newAgent = new Agent($agent["agent_name"]);
            $newAgent->setId($agent["agent_ID"]);
            return $newAgent;
        } else {
            return null;
        }
    }

    public function createAgent(Agent $agent) :?Agent {
        $newAgent = $this->findByName($agent->getAgent_name());
        if ($newAgent === null) {
            $query = $this->db->prepare("INSERT INTO agents VALUES(null, :agent_name)");
            $parameters = [
                "agent_name" => $agent->getAgent_name(),
            ];
            $query->execute($parameters);
            $lastId = $this->db->lastInsertId();
            $agent->setId($lastId);
            return $this->findById($agent->getId());
        } else {
            return $newAgent;
        }
        
    }

    public function editAgent(Agent $agent) :?Agent {
        $query = $this->db->prepare("UPDATE agents SET agent_name = :agent_name WHERE agent_ID = :agent_ID");
        $parameters = [
            "agent_name"=>$agent->getAgent_name(),
            "agent_ID"=>$agent->getId()
,        ];
            $query->execute($parameters);
            return $this->findById($agent->getId());
    }


    public function deleteAgent(Agent $agent) : void {
        $query = $this->db->prepare("DELETE FROM agents WHERE agent_ID = :agent_ID");
        $parameters = [
            "agent_ID" => $agent->getId(),
        ];
        $query->execute($parameters);
    }
}