<?php

class AgentController extends AbstractController {

    private AgentManager $am;

    public function __construct()
    {
        $this->am = new AgentManager;   
    }

    public function findAll() {
        $agents = $this->am->findAll();
        if ($agents !=null) {
            $agentsArray = [];
            foreach ($agents as $agent) {
                $newAgent = $agent->toArray();
                $agentsArray[] = $newAgent;
            }
            $this->render(["agents" => $agentsArray]);
        }
    }

    public function createAgents(array $post) {
        $agent = $this->am->findByName(htmlspecialchars($post["agent_name"]));
        if ($agent === null) {
            $agent = new Agent(htmlspecialchars($post["agent_name"]));
            $newAgent = $this->am->createAgent($agent);
            $this->render(["success"=> true, "newAgent"=>$newAgent->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message" => "Agent déjà dans la BDD"]);
        }
    }

    public function editAgents(array $post) {
        $agent = $this->am->findById($post["agent_ID"]);
        if ($agent !== null) {
            $agent->setAgent_name(htmlspecialchars($post["agent_name"]));
            $newAgent = $this->am->editAgent($agent);
            $this->render(["success" =>true, "editedAgent"=> $newAgent->toArray()]);
        }
    }

    public function deleteAgent(array $post) {
        $agent = $this->am->findById($post["agent_ID"]);
        if ($agent !== null) {
            $this->am->deleteAgent($agent);
        }
    }
}